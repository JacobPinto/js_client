import express from 'express';

import { ServerConfig } from './serverConfig.js';
import userRouter from './user/user.js'; // use the default export

// not a constrcutor but rather a function (may be singleton pattern)
const app = express();

// Boilerplate
// set html view engine
app.set("view engine", "ejs");
// By involking app.use() we reuse this stuff across multiple endpoints
// Middleware can also be with router.use(...)
function loggerMiddleware(req:any,res:any,next:any){
  console.log(req.originalUrl);
  next();
}
app.use(loggerMiddleware);
app.use(express.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json
//================================

// Routers
app.use("/user", userRouter);


// GET endpoint (req,res, next) is also possible
app.get('/',(req,res)=>{ 
  console.log("get req");

  // most basic response
  //res.send('Hello World!');

  // query parameters
  //console.log(req.query.name);

  // more common
  //res.sendStatus(500);

  // also
  //res.status(200).send('OK').json({message: "Hello World!"});

  // send a file to user to download
  //res.download("server/server.ts");

  // render html/ejs page. Requires views folder in root directory
  res.render("test");
});

// Routes to split up the main server file
// Create routes/users.ts for this to work
// and therin const router = express.Router();
/*const userRouter = require('./routes/users');
app.use("/users", userRouter);*/

// ALWAYS place the static routes above the dynamic routes


// handle dynamic routes
// The :userID and :bookId are dynamic parameters from req.params
app.get('/users/:userId',(req,res)=>{
  req.params.userId
  res.send("User ID: " + req.params.userId);
});

// json body
// req.body.<json name>

// Redirect a respose through another endpoint

// Listen on port
app.listen(ServerConfig.port);