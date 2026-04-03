import express from "express";

const router = express.Router();

// type BoundaryType = "constant_velocity_wall" | "bounce_back";

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
}

//In-memory storage for LB Solvers 
const solver = new LBSolver();

//routes

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


// DELETE
router.delete("/", (req, res) => {
  solver.reset();

  res.json({
    message: "LB Solver reset successfully",
  });
});

export default router;