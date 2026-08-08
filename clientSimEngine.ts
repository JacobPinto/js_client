import { ViewSimEngine } from './v/viewSimEngine.js';
import { ModelSimEngine } from './m/modelSimEngine.js';
import { ControllerSimEngine } from './c/controllerSimEngine.js';

export function start() {

  const model: ModelSimEngine = new ModelSimEngine();
  const controller: ControllerSimEngine = new ControllerSimEngine(model);
  const view: ViewSimEngine = new ViewSimEngine(controller);

  // Render the view
  console.log("Program start!");
  view.render();
}