import express from "express";
const router = express.Router();

class Block { 
  blockId: number;
  nb_points: [number, number]; // 3d dynamic array for one two or three dimensions, but for now we will stick to 2d
  start_coords: [number, number]; // same as above
  end_coords: [number, number]; // same as above

  constructor(
    blockId: number,
    nb_points: [number, number],
    start_coords: [number, number],
    end_coords: [number, number]
  ) {
    this.blockId = blockId;
    this.nb_points = nb_points;
    this.start_coords = start_coords;
    this.end_coords = end_coords;
  }

  update(data: Partial<Block>) { 
    if (data.nb_points) this.nb_points = data.nb_points;
    if (data.start_coords) this.start_coords = data.start_coords;
    if (data.end_coords) this.end_coords = data.end_coords;
  }

  validate() {
    const [nx, ny] = this.nb_points; 
    const [x1, y1] = this.start_coords;
    const [x2, y2] = this.end_coords;

    return nx > 0 && ny > 0 && x2 > x1 && y2 > y1;
  }
}
// Grid class is a collection of blocks.

class Grid {
  gridId: number;
  blocks: Block[];

  constructor(gridId: number, blocks: Block[] = []) {
    this.gridId = gridId;
    this.blocks = blocks;
  }

   addBlock(block: Block) {
    this.blocks.push(block);
  }

  removeBlock(blockId: number) {
    const index = this.blocks.findIndex(b => b.blockId === blockId);
    if (index === -1) return false;

    this.blocks.splice(index, 1);
    return true;
  }

}


//In-Memory Storage
const grids: Grid[] = [];

//Routes

// CREATE GRID
router.post("/", (req, res) => {
  const { gridId } = req.body;

  const existing = grids.find(g => g.gridId === gridId);
  if (existing) {
    return res.status(400).json({ error: "Grid already exists" });
  }

  const grid = new Grid(gridId);
  grids.push(grid);

  res.json({ success: true, grid });
});


// CREATE BLOCK inside GRID
router.post("/:gridId/block", (req, res) => {
  const { gridId } = req.params;
  const { blockId, nb_points, start_coords, end_coords } = req.body;

  const grid = grids.find(g => g.gridId === Number(gridId));
  if (!grid) {
    return res.status(404).json({ error: "Grid not found" });
  }

  const block = new Block(blockId, nb_points, start_coords, end_coords);

  if (!block.validate()) {
    return res.status(400).json({ error: "Invalid block" });
  }

  grid.addBlock(block);

  res.json({ success: true, block });
});


// DELETE BLOCK
router.delete("/grid/:gridId/block/:blockId", (req, res) => {
  const { gridId, blockId } = req.params;

  const grid = grids.find(g => g.gridId === Number(gridId));
  if (!grid) return res.status(404).json({ error: "Grid not found" });

  const removed = grid.removeBlock(Number(blockId));
  if (!removed) return res.status(404).json({ error: "Block not found" });

  res.json({ success: true });
});

// DELETE GRID
router.delete("/:gridId", (req, res) => {
  const index = grids.findIndex(g => g.gridId === Number(req.params.gridId));

  if (index === -1) {
    return res.status(404).json({ error: "Grid not found" });
  }

  grids.splice(index, 1);

  res.json({ success: true });
});

export default router;