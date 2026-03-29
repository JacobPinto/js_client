import express from "express";
import { UserInfo } from "../user/user.js";

const router = express.Router();

// type BoundaryType = "constant_velocity_wall" | "bounce_back";

class LBSolver {
  private _owner: UserInfo;
  private _eqn_str: string | null = null;
  private _velocity: number | null = null;
  private _viscosity: number | null = null;
  // private type: BoundaryType = "constant_velocity_wall";
  // private norm: number = 0;
  // private data?: number;
  private _run: number = 0;


  constructor(owner: UserInfo) {
    this._owner = owner;
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

  get owner() {
    return this._owner;
  }
}

//In-memory storage for LB Solvers 
const lbSolvers: LBSolver[] = [];

function getLBSolverForUser(user: UserInfo): LBSolver {
  let solver = lbSolvers.find(
    (s) => s.owner.userId === user.userId
  );

  if (!solver) {
    solver = new LBSolver(user);
    lbSolvers.push(solver);
  }

  return solver;
}

// Helper to ensure user is authenticated 
function requireUser(req: any, res: any): UserInfo | null {
  const user = req.user as UserInfo | undefined;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  return user;
}

//routes

router.post("/eqn_str", (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const { eqn_str } = req.body;

    if (!eqn_str) {
      return res.status(400).json({
        error: "eqn_str is required",
      });
    }

    const solver = getLBSolverForUser(user);
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
    const user = requireUser(req, res);
    if (!user) return;

    const { velocity, viscosity } = req.body;

    if (velocity === undefined || viscosity === undefined) {
      return res.status(400).json({
        error: "velocity & viscosity required",
      });
    }

    const solver = getLBSolverForUser(user);
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
    const user = requireUser(req, res);
    if (!user) return;  

    const { run } = req.body;

    if (run === undefined) {
      return res.status(400).json({
        error: "run is required",
      });
    }
    const solver = getLBSolverForUser(user);
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


 //Get full solver state

router.get("/", (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const solver = getLBSolverForUser(user);

  res.json({
    eqn_str: solver.eqn_str,
    initial_conditions: {
      velocity: solver.velocity,
      viscosity: solver.viscosity,
    },
    run: solver.run,
  });
});
router.delete("/", (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const solver = getLBSolverForUser(user);
  solver.reset();

  res.json({
    message: "LB Solver reset successfully",
  });
});

export default router;