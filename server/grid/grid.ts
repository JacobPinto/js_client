import express from "express";
import { UserInfo } from "../user/user.js";

const router = express.Router();


// Grid Class

class Grid {
  name: string;
  owner: UserInfo;
  nb_points: [number, number];
  start_coords: [number, number];
  end_coords: [number, number];

  constructor(
    name: string,
    owner: UserInfo,
    nb_points: [number, number],
    start_coords: [number, number],
    end_coords: [number, number]
  ) {
    this.name = name;
    this.owner = owner;
    this.nb_points = nb_points;
    this.start_coords = start_coords;
    this.end_coords = end_coords;
  }

  update(data: Partial<Grid>) {
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

//In-Memory Storage

const grids: Grid[] = [];


//Routes


// CREATE
router.post("/block", (req, res) => {
  const { name, nb_points, start_coords, end_coords } = req.body;
  const owner = req.user;
  if (!owner) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const grid = new Grid(
    name,
    owner,
    nb_points,
    start_coords,
    end_coords
  );

  if (!grid.validate()) {
    return res.status(400).json({ error: "Invalid grid" });
  }

  grids.push(grid);

  res.json({ success: true, grid });
});

// GET (user-specific)
router.get("/block", (req, res) => {
  const userGrids = grids.filter(
    g => g.owner.userId === req.userId
  );

  res.json({ grids: userGrids });
});

// UPDATE
router.put("/block/:name", (req, res) => {
  const grid = grids.find(
    g => g.name === req.params.name && g.owner.userId === req.userId
  );

  if (!grid) return res.status(404).json({ error: "Not found" });

  grid.update(req.body);

  res.json({ success: true, grid });
});

// DELETE
router.delete("/block/:name", (req, res) => {
  const index = grids.findIndex(
    g => g.name === req.params.name && g.owner.userId === req.userId
  );

  if (index === -1) return res.status(404).json({ error: "Not found" });

  grids.splice(index, 1);

  res.json({ success: true });
});

export default router;