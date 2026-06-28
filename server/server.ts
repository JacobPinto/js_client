
import express from 'express';
import cors from 'cors';  
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';

import { ServerConfig } from './serverConfig.js';
// import userRouter from './user/user.js'; // use the default export
// import { isCurrentUser, findUserInfoByUserId } from './user/user.js';
import geometryRouter from './geometry/geometry.js';
import projectRouter from './project.js';
import gridRouter from './grid/grid.js';
import cameraRouter from './camera/camera.js';
import LBSolverRouter from './lbSolver/lbSolver.js';
import { startGrpcServer } from './grpc/grpcServer.js';
import { startGrpcServerCamera } from './grpc/grpcServerCamera.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// not a constructor but rather a function (may be singleton pattern)
const app = express();

// Boilerplate
// set html view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
// By involking app.use() we reuse this stuff across multiple endpoints
// Middleware can also be with router.use(...)

function loggerMiddleware(req:any,res:any,next:any){
  console.log(req.originalUrl);
  next();
}

// place CORS early so other middleware/routes see the headers
app.use(cors());
app.use(loggerMiddleware);
app.use(express.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json
//================================

// Serve static files from project root
app.use(express.static(path.join(__dirname, '..')));

// Routers
//app.use("/user", userRouter); // For all user related endpoints

/* 
 * Once the user gets logged in, all endpoints must start with userID so
 * we need a piece of middleware to redirect and alter these requests
 */
//can be used later to validate if user exists 
/*app.use('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  
  // Validate if user exists
  const userExists = isCurrentUser(userId);
  if (!userExists) {
    return res.status(404).json({ 
      success: false, 
      error: `User ${userId} not found or not active` 
    });
  }
  
  // Add userId and user object to request for sub-routers to use
  req.userId = userId;
  req.user = findUserInfoByUserId(userId);
  next();
});
*/

// Service specific routers
app.use("/geometry", geometryRouter);
app.use("/project", projectRouter);
app.use("/grid", gridRouter);
app.use("/camera", cameraRouter);
app.use("/lb_solver", LBSolverRouter);

// ============ Camera Rendering Pipeline Endpoints ============
// This implements the core rendering loop for the simulation:
// 1. Client captures mouse movements (pan, zoom, rotate) in Canvas
// 2. Server receives camera state and writes camera.json (Step 2)
// 3. Server render engine reads camera.json and generates output.jpeg
// 4. Client fetches output.jpeg with 80ms refresh rate (Step 3)

// #TBD
// camera endpoint should be treated like a class (for eg grid and lbsolver)
// serve output.jpeg to be served on client.


// GET endpoint for test.html (main app entry)
app.get('/', (req, res) => { 
  console.log("get req");
  res.sendFile(path.join(__dirname, '..', 'test.html'));
});

// Routes to split up the main server file
// Create routes/users.ts for this to work
// and therin const router = express.Router();

/*const userRouter = require('./routes/users');
app.use("/users", userRouter);*/

// ALWAYS place the static routes above the dynamic routes


// handle dynamic routes
// The :userID and :bookId are dynamic parameters from req.params
/*app.get('/users/:userId',(req,res)=>{
  req.params.userId
  res.send("User ID: " + req.params.userId);
});
*/

// json body
// req.body.<json name>

// Redirect a respose through another endpoint

// Listen on port
app.listen(ServerConfig.port, () => {
  console.log(`HTTP server running at http://localhost:${ServerConfig.port}`);

  // Start gRPC server after HTTP server starts
  //startGrpcServer();
  startGrpcServerCamera();
});
