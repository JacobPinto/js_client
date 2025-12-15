import { ViewSimEngine } from './v/viewSimEngine.js';
import { ModelSimEngine } from './m/modelSimEngine.js';
import { ControllerSimEngine } from './c/controllerSimEngine.js';

export function start() {

 /* var view: ViewSimEngine = new ViewSimEngine();
  var model: ModelSimEngine = new ModelSimEngine();
  var controller: ControllerSimEngine = new ControllerSimEngine(model, view);

  */ 
  const model: ModelSimEngine = new ModelSimEngine();
  const controller: ControllerSimEngine = new ControllerSimEngine(model, new ViewSimEngine(null as any, model));
  const view: ViewSimEngine = new ViewSimEngine(controller, model);

  controller.setView(view);
  controller.initialize();

  console.log("Hello World from app.ts!");
}