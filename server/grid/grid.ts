import express from "express";
import { JSONWritable } from "../jsonWritable.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { idCounter } from "../idCounter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
// #TBD 
// Client server/sided object.
// 1.every CSO has a id.
// 2.all the members of the cso are private expect constructor and getter. to control the state of the CSO tightly
// 2.a the state of the CSO is mostly controlled by the endpoints.
// 3. every CSO on the server side needs to be owned by a manager object.
// Client side
// communication interface between GUi and server
// it must contain an unique id which matches the server side

// type BlockUpdate = {
//   nb_points?: [number, number];
//   start_coords?: [number, number];
//   end_coords?: [number, number];
// };

class Block { 
  private _blockId: number; // #TBD auto generated unique id for the block
  private _nb_points: number[]; // dynamic array for one, two, or three dimensions
  private _start_coords: number[]; // dynamic array for one, two, or three dimensions
  private _end_coords: number[]; // dynamic array for one, two, or three dimensions

  constructor(
    blockId: number,
    nb_points: number[],
    start_coords: number[],
    end_coords: number[]
  ) {
    this._blockId = blockId;
    this._nb_points = nb_points;
    this._start_coords = start_coords;
    this._end_coords = end_coords;

    // if (!this.validate()) {
    //   throw new Error("Invalid block parameters");
    // }
  }

  getId() {
    return this._blockId;
  }

  toJSON() {
    return {
      blockId: this._blockId,
      nb_points: this._nb_points,
      start_coords: this._start_coords,
      end_coords: this._end_coords,
    };
  }
  

  // private update(data: BlockUpdate) { 
  //   if (data.nb_points) this._nb_points = data.nb_points;
  //   if (data.start_coords) this._start_coords = data.start_coords;
  //   if (data.end_coords) this._end_coords = data.end_coords;
  // }

  // private validate() {
  //   const [nx, ny] = this._nb_points; 
  //   const [x1, y1] = this._start_coords;
  //   const [x2, y2] = this._end_coords;

  //   return nx > 0 && ny > 0 && x2 > x1 && y2 > y1;
  // }
}
// Grid class is a collection of blocks.

/* =========================
   GRID (CSO)
========================= */
class Cartesion_Grid extends JSONWritable {
  private _gridId: number;
  private _blocks: Map<number, Block>;

  constructor(gridId: number) {
    super();
    this._gridId = gridId;
    this._blocks = new Map();
  }

  getId() {
    return this._gridId;
  }

  getKey() {
    return `grid_${this._gridId}`;
  }

  addBlock(block: Block) {
    if (this._blocks.has(block.getId())) {
      throw new Error("Block ID already exists");
    }
    this._blocks.set(block.getId(), block);
  }

  removeBlock(blockId: number) {
    return this._blocks.delete(blockId);
  }

  toJSON() {
    return {
      gridId: this._gridId, // #TBD rename grid class to cartesian grid and also remove _id
      block: Array.from(this._blocks.values()).map(b => b.toJSON()),
    };
  }

  // Override write() to store grids in a single array instead of individual keys
  write() {
    let existing: any = {};

    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        existing = raw ? JSON.parse(raw) : {};
      }

      // Ensure grids array exists
      if (!Array.isArray(existing.cartesian_grid)) {
        existing.cartesian_grid = [];
      }

      // Find and update existing grid or add new one
      const gridIndex = existing.cartesian_grid.findIndex((g: any) => g.gridId === this._gridId);
      if (gridIndex >= 0) {
        existing.cartesian_grid[gridIndex] = this.toJSON();
      } else {
        existing.cartesian_grid.push(this.toJSON());
      }

      fs.writeFileSync(this.filePath, JSON.stringify(existing, null, 2));
      console.log(`Grid ${this._gridId} persisted to ${this.filePath}`);
    } catch (err) {
      console.error(`Error writing to ${this.filePath}:`, err);
    }
  }
}

/* =========================
   GRID MANAGER (OWNER)
========================= */
class GridManager {
  private _grids: Map<number, Cartesion_Grid> = new Map();

  createGrid(gridId: number) {
    if (this._grids.has(gridId)) {
      throw new Error("Grid already exists");
    }
    const grid = new Cartesion_Grid(gridId);
    this._grids.set(gridId, grid); 
  }

  getGrid(gridId: number) {
    return this._grids.get(gridId);
  }

  deleteGrid(gridId: number) {
    return this._grids.delete(gridId);
  }

  loadFromFile() {
    try {
      const simulationPath = path.join(__dirname, "../../simulation.json");

      if (fs.existsSync(simulationPath)) {
        const data = JSON.parse(fs.readFileSync(simulationPath, "utf-8"));

        // Load all grids from the 'cartesian_grid' array
        if (Array.isArray(data.cartesian_grid)) {
          const loadedGridIds: number[] = [];
          const loadedBlockIds: number[] = [];

          data.cartesian_grid.forEach((gridData: any) => {
            const cartesion_grid = new Cartesion_Grid(gridData.gridId);
            loadedGridIds.push(gridData.gridId);

            gridData.block?.forEach((b: any) => {
              const block = new Block(
                b.blockId,
                b.nb_points,
                b.start_coords,
                b.end_coords
              );
              cartesion_grid.addBlock(block);
              loadedBlockIds.push(b.blockId);
            });

            this._grids.set(cartesion_grid.getId(), cartesion_grid);
            console.log(`Loaded grid ${gridData.gridId} from simulation.json`);
          });

          idCounter.sync("grid", loadedGridIds);
          idCounter.sync("block", loadedBlockIds);
        }
      }
    } catch (err) {
      console.warn("Init failed:", err);
    }
  }
}

const gridManager = new GridManager();

// all objects live in manager maps in memory, loadedIds are computed from memory objects.
gridManager.loadFromFile();


/* =========================
   ROUTES
========================= */

// CREATE GRID
router.post("/", (req, res) => {
  try {
    const gridId = idCounter.next("grid");
    gridManager.createGrid(gridId);
    const grid = gridManager.getGrid(gridId);
    if (!grid) {
      throw new Error("Failed to create grid");
    }
    grid.write(); 

    res.json({ success: true, gridId, grid });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// CREATE BLOCK
router.post("/:gridId/block", (req, res) => {
  try {
    const { gridId } = req.params;
    const blockId = idCounter.next("block");
    const {nb_points, start_coords, end_coords } = req.body;

    const grid = gridManager.getGrid(Number(gridId));
    if (!grid) return res.status(404).json({ error: "Grid not found" });

    const block = new Block(blockId, nb_points, start_coords, end_coords);
    grid.addBlock(block);
    grid.write(); 

    res.json({ success: true, block });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE BLOCK
router.delete("/:gridId/block/:blockId", (req, res) => {
  const grid = gridManager.getGrid(Number(req.params.gridId));
  if (!grid) return res.status(404).json({ error: "Grid not found" });

  const removed = grid.removeBlock(Number(req.params.blockId));
  if (!removed) return res.status(404).json({ error: "Block not found" });

  grid.write();
  res.json({ success: true });
});

// DELETE GRID
router.delete("/:gridId", (req, res) => {
  const { gridId } = req.params;
  const deleted = gridManager.deleteGrid(Number(req.params.gridId));
  if (!deleted) return res.status(404).json({ error: "Grid not found" });

  const simulationPath = path.join(__dirname, "../../simulation.json");
  if (fs.existsSync(simulationPath)) {
    const data = JSON.parse(fs.readFileSync(simulationPath, "utf-8"));
    if (Array.isArray(data.cartesian_grid)) {
      data.cartesian_grid = data.cartesian_grid.filter((g: any) => g.gridId !== Number(gridId));
      fs.writeFileSync(simulationPath, JSON.stringify(data, null, 2));
    }
  }

  res.json({ success: true });
});

export default router;