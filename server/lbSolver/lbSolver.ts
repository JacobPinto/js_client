import express from "express";

const router = express.Router();

export enum BoundaryType {
  ConstantVelocityWall = "constant_velocity_wall",
  bounceBack = "bounce_back",
}

// Base Class for Boundary Conditions
class BoundaryCondition {
  private _type: BoundaryType;
  private _data?: number[]; // vector of data for the boundary condition
  private _norm: number; // normal vector for the boundary condition, if applicable
  
  constructor(type: BoundaryType, data: number[] | undefined, norm: number) {
    this._type = type;
    this._data = data; 
    this._norm = norm;
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


class LBSolver {

  // method to write its data to a json file

// #TBD there should be a write method to add this data to a json file 
// this write method shouldnt override other methods on the json file.
// same for grid and geometry

  private _eqn_str: string | null = null;
  private _velocity: number | null = null;
  private _viscosity: number | null = null;
  // private type: BoundaryType = "constant_velocity_wall";
  // private norm: number = 0;
  // private data?: number;
  private _run: number = 0;

  // #TDB base class for the boundary conditions 
  // for each type of boundary conditions there will be a child class and child class will extend the base class
  // some members of the boundry condition class type will be a enum, data should be a vector, list of boundary condn bassed on interface class.
  //this list of boundry condn stored in lbsolver class

  //list of boundary conditions for the lb solver
  private _boundaryConditions: BoundaryCondition[] = [];

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


//In-memory storage for LB Solvers 
const solver = new LBSolver();

//routes
// POST Equation String
router.post("/eqn_str", (req, res) => {
  try {

    const { eqn_str } = req.body;

    if (!eqn_str) {
      return res.status(400).json({
        error: "eqn_str is required",
      });
    }

    solver.setEquation(eqn_str);

    res.json({
      message: "Equation set successfully",
      eqn_str: solver.eqn_str,
    });
  } catch {
    res.status(500).json({
      error: "Failed to set equation",
    });
  }
});

// POST Initial Conditions
router.post("/initial_conditions", (req, res) => {
  try {

    const { velocity, viscosity } = req.body;

    if (velocity === undefined || viscosity === undefined) {
      return res.status(400).json({
        error: "velocity & viscosity required",
      });
    }
    solver.setInitialConditions(velocity, viscosity);

    res.json({
      message: "Initial conditions set successfully",
      velocity: solver.velocity,
      viscosity: solver.viscosity,
    });
  } catch {
    res.status(500).json({
      error: "Failed to set initial conditions",
    });
  }
});

// POST run
router.post("/run", (req, res) => {
  try {

    const { run } = req.body;

    if (run === undefined) {
      return res.status(400).json({
        error: "run is required",
      });
    }
    solver.setRun(run);

    res.json({
      message: "Run set successfully",
      run: solver.run,
    });
  } catch {
    res.status(500).json({
      error: "Failed to set run",
    });
  } 
});

// POST Boundary Condition
router.post("/boundary_condition", (req, res) => {
  try {
    const { type, data, norm } = req.body;
    if (!type || !norm) {
      return res.status(400).json({
        error: "type and norm are required",
      });
    }

    const bc = new BoundaryCondition(type, data, norm);
    solver.addBoundaryCondition(bc);

    res.json({
      message: "Boundary condition added successfully",
      boundaryCondition: bc,
    });
  } catch {
    res.status(500).json({
      error: "Failed to add boundary condition",
    });
  }
});

// DELETE
router.delete("/", (req, res) => {
  solver.reset();

  res.json({
    message: "LB Solver reset successfully",
  });
});

export default router;