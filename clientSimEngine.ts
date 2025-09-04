import { ViewSimEngine } from './v/viewSimEngine.js';
import { ModelSimEngine } from './m/modelSimEngine.js';
import { ControllerSimEngine } from './controller/controllerSimEngine.js';

export function start() {

  var view: ViewSimEngine = new ViewSimEngine();
  var model: ModelSimEngine = new ModelSimEngine();
  var controller: ControllerSimEngine = new ControllerSimEngine(model, view);

  controller.initialize();

  console.log("Hello World from app.ts!");
}


/*import * as readline from 'readline';

var a: number = 5;
var b: number[] = [];
b = [1, 2, 3, 4];

interface 

var c: object = { name: 'John', age: 30 };

console.log(c.age);

var d: Array<string> = new Array();
d = new Array('Hello', 'World');

console.log(Number.isInteger(a) );

function square(x: number): boolean {
    if (x === 2) {
        return true;
    }
    return x.toString() === '4';
}

var x: string = 'Hello';

console.log(x.length);
console.log('Hello world', square(4));

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Press enter to exit...', () => { rl.close(); });
*/
