import express from "express";
import fs from "fs";
import jsonWriter from "../base/jsonWriter.js";
import path from "path";
import { fileURLToPath } from "url";
import { idCounter } from "../idCounter.js";
import { toVector } from "../utils.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SIMULATION_PATH = path.join(__dirname, "../../simulation.json");

const router = express.Router();

// all enums and classes will be in lb solver and private
export enum BoundaryType {
  ConstantVelocityWall = "constant_velocity_wall",
  bounceBack = "bounce_back",
}

// Class for Initial Conditions
class InitialConditions {
  private _velocity: number;
  private _viscosity: number;

  constructor(velocity: number, viscosity: number) {
    this._velocity = velocity;
    this._viscosity = viscosity;
  }

  // Getters
  get velocity() {
    return this._velocity;
  }

  get viscosity() {
    return this._viscosity;
  }
}
// class for Run

class Run {
  private _iterationCount: number;

  constructor(iterationCount: number) {
    this._iterationCount = iterationCount;
  }
  get iterationCount() {
    return this._iterationCount;
  }
}

// Base Class for Boundary Conditions // rename BoundaryConditionBase
class BoundaryConditionBase  {
  // unique id for the boundary condition
  private _bcId: number;
  private _type: BoundaryType;
  private _data?: number[]; // vector of data for the boundary condition //
  private _norm: number[]; // normal vector for the boundary condition, if applicable. normal is also a vector like data

  constructor(
    bcId: number,
    bctype: BoundaryType,
    data: number[] | undefined,
    norm: number[],
  ) {
    this._bcId = bcId;
    this._type = bctype;
    this._data = data;
    this._norm = norm;
  }

  get bcId() {
    return this._bcId;
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
class ConstantVelocityWall extends BoundaryConditionBase {
  constructor(bcId: number, data: number[] | undefined, norm: number[]) {
    super(bcId, BoundaryType.ConstantVelocityWall, data, norm);
  }

  // // each componenet will have its toJson()
  //  toJSON() {
  //   return {
  //     bcId: this.bcId,
  //     type: this.type,
  //     norm: this.norm,
  //     data: this.data,
  //   };
  // }
}

// Child Class for Bounce Back Boundary Condition
class BounceBack extends BoundaryConditionBase {
  constructor(bcId: number, norm: number[]) {
    super(bcId, BoundaryType.bounceBack, undefined, norm);
  }
  // each componenet will have its toJson()
  // toJSON() {
  //   return {
  //     bcId: this.bcId,
  //     type: this.type,
  //     norm: this.norm,
  //   };
  // }
}

// FACTORY CLASS for creating boundary conditions based on type
class BoundaryConditionFactory {
  static create(
    type: BoundaryType,
    bcId: number,
    data?: number[],
    norm: number[] = [0],
  ): BoundaryConditionBase {
    switch (type) {
      case BoundaryType.ConstantVelocityWall:
        return new ConstantVelocityWall(bcId, data, norm);

      case BoundaryType.bounceBack:
        return new BounceBack(bcId, norm);

      default:
        throw new Error(`Unsupported Boundary Type: ${type}`);
    }
  }
}

class LBSolver {
  // method to write its data to a json file

  // #TBD there should be a write method to add this data to a json file
  // this write method shouldnt override other methods on the json file.
  // same for grid and geometry

  private _lbId: number;
  private _name: string;
  private _outputFilePath: string;
  private _eqn_str: string | null = null;

  // #TDB base class for the boundary conditions
  // for each type of boundary conditions there will be a child class and child class will extend the base class
  // some members of the boundry condition class type will be a enum, data should be a vector, list of boundary condn bassed on interface class.
  //this list of boundry condn stored in lbsolver class

  //list of boundary conditions for the lb solver
  private _run: Run | null = null;
  private _initialConditions: InitialConditions | null = null;
  private _boundaryConditions: BoundaryConditionBase[] = [];

  constructor(lbId: number) {
    this._lbId = lbId;
    this._name = `lbSolver_${lbId}`;
    this._outputFilePath = path.join("clientInput", this._name);
  }

  getId() {
    return this._lbId;
  }

  // write() to store solvers in a single array instead of individual keys
  write() {
    jsonWriter.postMessage({ type: "arrayMerge", arrayKey: "lb_solver", idField: "id",
                           id: this._lbId, data: this.toJSON(), filePath: this._outputFilePath });
  }

  toJSON() {
    return {
      id: this._lbId,
      eqn_str: this._eqn_str,
      initial_conditions: this._initialConditions
        ? {
            velocity: this._initialConditions.velocity,
            viscosity: this._initialConditions.viscosity,
          }
        : null,
      run: this._run
        ? {
            iteration_count: this._run.iterationCount,
          }
        : null,
      boundary_conditions: this._boundaryConditions.map((bc) => ({
        id: bc.bcId,
        type: bc.type,
        data: bc.data, // package it has a vector
        norm: bc.norm, // package has a vector
      })),
      // boundaryConditions:
      // this._boundaryConditions.map((bc) =>
      //   bc.toJSON()
      // ),
    };
  }

  /* ===== SETTERS ===== */

  setEquation(eqn: string) {
    this._eqn_str = eqn;
  }

  setInitialConditions(velocity: number, viscosity: number) {
    this._initialConditions = new InitialConditions(velocity, viscosity);
  }

  setRun(iterationCount: number) {
    this._run = new Run(iterationCount);
  }

  addBoundaryCondition(bc: BoundaryConditionBase) {
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
    this._initialConditions = null;
    this._run = null;
    this._boundaryConditions = [];
  }

  /* ===== GETTERS ===== */

  get eqn_str() {
    return this._eqn_str;
  }

  get initialConditions() {
    return this._initialConditions;
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

        // Load all solvers from the 'lb_solver' array
        if (Array.isArray(data.lb_solver)) {
          const loadedSolverIds: number[] = [];
          const loadedBcIds: number[] = [];

          data.lb_solver.forEach((solverData: any) => {
            const solver = new LBSolver(solverData.id);
            loadedSolverIds.push(solverData.id);

            if (solverData.eqn_str) solver.setEquation(solverData.eqn_str);
            if (solverData.initialConditions) {
              solver.setInitialConditions(
                solverData.initialConditions.velocity,
                solverData.initialConditions.viscosity
              );
            }

            if (solverData.run) {
              solver.setRun(solverData.run.iterationCount);
            }

            if (solverData.boundaryConditions) {
              solverData.boundaryConditions.forEach((bc: any) => {
                solver.addBoundaryCondition(
                  BoundaryConditionFactory.create(
                    bc.type,
                    bc.id,
                    bc.data,
                    bc.norm,
                  ),
                );
                loadedBcIds.push(bc.id);
              });
            }

            this.solvers.set(solver.getId(), solver);
            console.log(`Loaded solver ${solverData.id} from simulation.json`);
          });

          idCounter.sync("lb_solver", loadedSolverIds);
          idCounter.sync("boundaryCondition", loadedBcIds);
        }
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
    solverManager.createSolver(lbId);
    const solver = solverManager.getSolver(lbId);

    if (!solver) {
      throw new Error("Failed to create solver");
    }
    solver.write(); // #TBD remove

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
  const solver = solverManager.getSolver(
    Number(req.params.lbId)
  );

  if (!solver) {
    return res.status(404).json({
      error: "Solver not found",
    });
  }

  const { iterationCount } = req.body;

  solver.setRun(iterationCount);

  solver.write();

  res.json({ success: true });
});

// ADD BC
router.post("/:lbId/boundary_condition", (req, res) => {
  const solver = solverManager.getSolver(
    Number(req.params.lbId)
  );

  if (!solver) {
    return res.status(404).json({
      error: "Solver not found",
    });
  }

  const { type } = req.body;

  const data = req.body.data
    ? toVector(req.body.data)
    : undefined;

  const norm = req.body.norm
    ? toVector(req.body.norm)
    : [0];

  const bcId = idCounter.next(
    "boundaryCondition"
  );

  const bc = BoundaryConditionFactory.create(
    type,
    bcId,
    data,
    norm,
  );

  solver.addBoundaryCondition(bc);

  solver.write();

  res.json({
    success: true,
    bcId,
  });
});

// DELETE SOLVER
router.delete("/:lbId", (req, res) => {
  const { lbId } = req.params;
  const deleted = solverManager.deleteSolver(Number(req.params.lbId));
  if (!deleted) return res.status(404).json({ error: "Solver not found" });

  res.json({ success: true });
});

export default router;
