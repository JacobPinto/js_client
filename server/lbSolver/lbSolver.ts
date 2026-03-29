import express from "express";
import { UserInfo } from "../user/user.js";

const router = express.Router();

class LBSolver {
  owner: UserInfo;
  eqn_str: string | null = null;
  velocity: number | null = null;
  viscosity: number | null = null;

  constructor(owner: UserInfo) {
    this.owner = owner;
  }

  setEquation(eqn: string) {
    this.eqn_str = eqn;
  }

  setInitialConditions(velocity: number, viscosity: number) {
    this.velocity = velocity;
    this.viscosity = viscosity;
  }

  reset() {
    this.eqn_str = null;
    this.velocity = null;
    this.viscosity = null;
  }
}


// In-Memory Storage

const lbSolvers: LBSolver[] = [];

function getLBSolverForUser(user: UserInfo): LBSolver {
  let solver = lbSolvers.find((s) => s.owner.userId === user.userId);
  if (!solver) {
    solver = new LBSolver(user);
    lbSolvers.push(solver);
  }
  return solver;
}

//Routes


function requireUser(req: any, res: any): UserInfo | null {
  const user = req.user as UserInfo | undefined;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return user;
}

// Set Equation
router.post("/eqn", (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const { eqn_str } = req.body;
    if (!eqn_str) {
      return res.status(400).json({ error: "eqn_str is required" });
    }

    const solver = getLBSolverForUser(user);
    solver.setEquation(eqn_str);

    res.json({
      message: "Equation set successfully",
      eqn_str: solver.eqn_str,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to set equation" });
  }
});

// Set Initial Conditions
router.post("/initial_conditions", (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const { velocity, viscosity } = req.body;
    if (velocity === undefined || viscosity === undefined) {
      return res.status(400).json({ error: "velocity & viscosity required" });
    }

    const solver = getLBSolverForUser(user);
    solver.setInitialConditions(velocity, viscosity);

    res.json({
      message: "Initial conditions set successfully",
      velocity: solver.velocity,
      viscosity: solver.viscosity,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to set initial conditions" });
  }
});

//  get LB Solver State
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
  });
});

// Reset Solver
router.delete("/", (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const solver = getLBSolverForUser(user);
  solver.reset();

  res.json({ message: "LB Solver reset" });
});

export default router;