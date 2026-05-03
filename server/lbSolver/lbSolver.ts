import express from "express";
import { JSONWritable } from "../jsonWritable.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { idCounter } from "../idCounter.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

export enum BoundaryType {
  ConstantVelocityWall = "constant_velocity_wall",
  bounceBack = "bounce_back",
}

// Base Class for Boundary Conditions
class BoundaryCondition {
  // unique id for the boundary condition
  private _type: BoundaryType;
  private _data?: number[]; // vector of data for the boundary condition
  private _norm: number; // normal vector for the boundary condition, if applicable
  
  constructor(type: BoundaryType, data: number[] | undefined, norm: number) {
    this._type = type;
    this._data = data; 
    this._norm = norm;
  }

  get type() {
    return this._type;
  }

  get data() {
    return this._data;
  }

  get norm() {
    return this._norm;
  }
}

// Child Class for Constant Velocity Wall Boundary Condition
class ConstantVelocityWall extends BoundaryCondition {
  constructor(data: number[] | undefined, norm: number) {
    super(BoundaryType.ConstantVelocityWall, data, norm);
  }
}


// Child Class for Bounce Back Boundary Condition
class BounceBack extends BoundaryCondition {
  constructor(data: number[] | undefined, norm: number) {
    super(BoundaryType.bounceBack, data, norm);
  }
}


class LBSolver extends JSONWritable {
  // method to write its data to a json file

  // #TBD there should be a write method to add this data to a json file
  // this write method shouldnt override other methods on the json file.
  // same for grid and geometry

  private _lbId: number;
  private _eqn_str: string | null = null;
  private _velocity: number | null = null;
  private _viscosity: number | null = null;
  private _run: number = 0;

  // #TDB base class for the boundary conditions
  // for each type of boundary conditions there will be a child class and child class will extend the base class
  // some members of the boundry condition class type will be a enum, data should be a vector, list of boundary condn bassed on interface class.
  //this list of boundry condn stored in lbsolver class

  //list of boundary conditions for the lb solver
  private _boundaryConditions: BoundaryCondition[] = [];

  constructor(lbId: number) {
    super();
    this._lbId = lbId;
  }

  getId() {
    return this._lbId;
  }

  getKey(): string {
    return `lbSolver_${this._lbId}`;
  }

  toJSON() {
    return {
      id: this._lbId,
      eqn_str: this._eqn_str,
      velocity: this._velocity, //
      viscosity: this._viscosity,
      run: this._run,
      boundaryConditions: this._boundaryConditions.map((bc) => ({
        type: bc.type,
        data: bc.data,
        norm: bc.norm,
      })),
    };
  }

  /* ===== SETTERS ===== */

  setEquation(eqn: string) {
    this._eqn_str = eqn;
  }

  setInitialConditions(velocity: number, viscosity: number) {
    this._velocity = velocity;
    this._viscosity = viscosity;
  }

  setRun(run: number) {
    this._run = run;
  }

  addBoundaryCondition(bc: BoundaryCondition) {
    this._boundaryConditions.push(bc);
  }

  removeBoundaryCondition(index: number) {
    if (index < 0 || index >= this._boundaryConditions.length) {
      throw new Error("Invalid boundary condition index");
    }
    this._boundaryConditions.splice(index, 1);
  }

  reset() {
    this._eqn_str = null;
    this._velocity = null;
    this._viscosity = null;
    this._run = 0;
    this._boundaryConditions = [];
  }

  /* ===== GETTERS ===== */

  get eqn_str() {
    return this._eqn_str;
  }

  get velocity() {
    return this._velocity;
  }

  get viscosity() {
    return this._viscosity;
  }

  get run() {
    return this._run;
  }

  get boundaryConditions() {
    return this._boundaryConditions;
  }
}

class LBSolverManager {
  private solvers: Map<number, LBSolver> = new Map();

  createSolver(id: number) {
    if (this.solvers.has(id)) {
      throw new Error("Solver already exists");
    }
    const solver = new LBSolver(id);
    this.solvers.set(id, solver);
    return solver;// remove
  }

  getSolver(id: number) {
    return this.solvers.get(id);
  }

  deleteSolver(id: number) {
    return this.solvers.delete(id);
  }

  loadFromFile() {
    try {
      const simulationPath = path.join(__dirname, "../../simulation.json");

      if (fs.existsSync(simulationPath)) {
        const data = JSON.parse(fs.readFileSync(simulationPath, "utf-8"));

        Object.keys(data).forEach((key) => {
          if (key.startsWith("lbSolver_")) {
            const s = data[key];

            const solver = new LBSolver(s.id);

            if (s.eqn_str) solver.setEquation(s.eqn_str);
            if (s.velocity !== null && s.viscosity !== null) {
              solver.setInitialConditions(s.velocity, s.viscosity);
            }
            if (s.run !== undefined) solver.setRun(s.run);

            if (s.boundaryConditions) {
              s.boundaryConditions.forEach((bc: any) => {
                solver.addBoundaryCondition(
                  new BoundaryCondition(bc.type, bc.data, bc.norm)
                );
              });
            }

            this.solvers.set(solver.getId(), solver);
            console.log(`Loaded solver ${s.id}`);
          }
        });
        const loadedIds = Array.from(this.solvers.keys());
        idCounter.sync("lb_solver", loadedIds);
      }
    } catch (err) {
      console.warn("LBSolver init failed:", err);
    }
  }
}

const solverManager = new LBSolverManager();
solverManager.loadFromFile();


//routes
// CREATE SOLVER
router.post("/", (req, res) => {
  try {
    const lbId = idCounter.next("lb_solver");
    const solver = solverManager.createSolver(lbId);
    solver.write();// #TBD remove

    res.json({ success: true, lbId, solver });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// SET EQUATION
router.post("/:lbId/eqn_str", (req, res) => {
  const solver = solverManager.getSolver(Number(req.params.lbId));
  if (!solver) return res.status(404).json({ error: "Solver not found" });

  solver.setEquation(req.body.eqn_str);
  solver.write();

  res.json({ success: true });
});

// INITIAL CONDITIONS
router.post("/:lbId/initial_conditions", (req, res) => {
  const solver = solverManager.getSolver(Number(req.params.lbId));
  if (!solver) return res.status(404).json({ error: "Solver not found" });

  const { velocity, viscosity } = req.body;
  solver.setInitialConditions(velocity, viscosity);
  solver.write();

  res.json({ success: true });
});

// RUN
router.post("/:lbId/run", (req, res) => {
  const solver = solverManager.getSolver(Number(req.params.lbId));
  if (!solver) return res.status(404).json({ error: "Solver not found" });

  solver.setRun(req.body.run);
  solver.write();

  res.json({ success: true });
});

// ADD BC
router.post("/:lbId/boundary_condition", (req, res) => {
  const solver = solverManager.getSolver(Number(req.params.lbId));
  if (!solver) return res.status(404).json({ error: "Solver not found" });

  const { type, data, norm } = req.body;

  const bc = new BoundaryCondition(type, data, norm);
  solver.addBoundaryCondition(bc);
  solver.write();

  res.json({ success: true });
});

// DELETE SOLVER
router.delete("/:lbId", (req, res) => {
  const { lbId } = req.params;
  const deleted = solverManager.deleteSolver(Number(req.params.lbId));
  if (!deleted) return res.status(404).json({ error: "Solver not found" });

  res.json({ success: true });
});

export default router;