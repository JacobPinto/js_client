import express from "express";
import { JSONWritable } from "../jsonWritable.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
// #TBD 
// Client server/sided object.
// 1.every CSO has a id 
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
  // private.
  private blockId: number;
  private nb_points: number[]; // dynamic array for one, two, or three dimensions
  private start_coords: number[]; // dynamic array for one, two, or three dimensions
  private end_coords: number[]; // dynamic array for one, two, or three dimensions

  constructor(
    blockId: number,
    nb_points: number[],
    start_coords: number[],
    end_coords: number[]
  ) {
    this.blockId = blockId;
    this.nb_points = nb_points;
    this.start_coords = start_coords;
    this.end_coords = end_coords;

    // if (!this.validate()) {
    //   throw new Error("Invalid block parameters");
    // }
  }

  getId() {
    return this.blockId;
  }

  toJSON() {
    return {
      blockId: this.blockId,
      nb_points: this.nb_points,
      start_coords: this.start_coords,
      end_coords: this.end_coords,
    };
  }
  

  // private update(data: BlockUpdate) { 
  //   if (data.nb_points) this.nb_points = data.nb_points;
  //   if (data.start_coords) this.start_coords = data.start_coords;
  //   if (data.end_coords) this.end_coords = data.end_coords;
  // }

  // private validate() {
  //   const [nx, ny] = this.nb_points; 
  //   const [x1, y1] = this.start_coords;
  //   const [x2, y2] = this.end_coords;

  //   return nx > 0 && ny > 0 && x2 > x1 && y2 > y1;
  // }
}
// Grid class is a collection of blocks.

/* =========================
   GRID (CSO)
========================= */
class Grid extends JSONWritable {
  private gridId: number;
  private blocks: Map<number, Block>;

  constructor(gridId: number) {
    super();
    this.gridId = gridId;
    this.blocks = new Map();
  }

  getId() {
    return this.gridId;
  }

  getKey() {
    return `grid_${this.gridId}`;
  }

  addBlock(block: Block) {
    if (this.blocks.has(block.getId())) {
      throw new Error("Block ID already exists");
    }
    this.blocks.set(block.getId(), block);
  }

  removeBlock(blockId: number) {
    return this.blocks.delete(blockId);
  }

  toJSON() {
    return {
      gridId: this.gridId,
      blocks: Array.from(this.blocks.values()).map(b => b.toJSON()),
    };
  }
}

/* =========================
   GRID MANAGER (OWNER)
========================= */
class GridManager {
  private grids: Map<number, Grid> = new Map();

  createGrid(gridId: number) {
    if (this.grids.has(gridId)) {
      throw new Error("Grid already exists");
    }
    const grid = new Grid(gridId);
    this.grids.set(gridId, grid);
    return grid;
  }

  getGrid(gridId: number) {
    return this.grids.get(gridId);
  }

  deleteGrid(gridId: number) {
    return this.grids.delete(gridId);
  }

  loadFromFile() {
    try {
      const simulationPath = path.join(__dirname, "../../simulation.json");

      if (fs.existsSync(simulationPath)) {
        const data = JSON.parse(fs.readFileSync(simulationPath, "utf-8"));

        // Load all grids with keys matching pattern grid_*
        Object.keys(data).forEach((key) => {
          if (key.startsWith("grid_")) {
            const gridData = data[key];
            const grid = new Grid(gridData.gridId);

            gridData.blocks.forEach((b: any) => {
              const block = new Block(
                b.blockId,
                b.nb_points,
                b.start_coords,
                b.end_coords
              );
              grid.addBlock(block);
            });

            this.grids.set(grid.getId(), grid);
            console.log(`Loaded grid ${gridData.gridId} from simulation.json`);
          }
        });
      }
    } catch (err) {
      console.warn("Init failed:", err);
    }
  }
}

const gridManager = new GridManager();
gridManager.loadFromFile();

/* =========================
   ROUTES
========================= */

// CREATE GRID
router.post("/", (req, res) => {
  try {
    const { gridId } = req.body;
    const grid = gridManager.createGrid(gridId);
    grid.write();

    res.json({ success: true, grid });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// CREATE BLOCK
router.post("/:gridId/block", (req, res) => {
  try {
    const { gridId } = req.params;
    const { blockId, nb_points, start_coords, end_coords } = req.body;

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
  const deleted = gridManager.deleteGrid(Number(req.params.gridId));
  if (!deleted) return res.status(404).json({ error: "Grid not found" });

  const simulationPath = path.join(__dirname, "../../simulation.json");
  if (fs.existsSync(simulationPath)) {
    const data = JSON.parse(fs.readFileSync(simulationPath, "utf-8"));
    delete data.grid;
    fs.writeFileSync(simulationPath, JSON.stringify(data, null, 2));
  }

  res.json({ success: true });
});

export default router;