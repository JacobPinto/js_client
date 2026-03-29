import { Dimensions, ShaderType, VertexFormat } from "../m/modelEnums.js";
import { SpeedUnit, AccelerationUnit } from "../m/quantities.js";

import { ModelSimEngine } from "../m/modelSimEngine.js";

/*
interface for server requests.
Defines the structure of HTTP requests sent to the backend.
*/
interface ServerRequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  body?: any;
}

/*
Generic server request function.
Used to send HTTP requests (GET, POST, PUT, DELETE) to the backend server.
This centralizes all fetch calls in one place.
*/

async function serverRequest(config: ServerRequestConfig) {
  const response = await fetch(`http://localhost:3000${config.endpoint}`, {
    method: config.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export class ControllerSimEngine {
  private _model: ModelSimEngine;

  constructor(model: ModelSimEngine) {
    this._model = model;
  }

  // Getters
  public get model(): ModelSimEngine {
    return this._model;
  }

  /* public updateSoftwareVersion(version: number): void {
    this._model.softwareVersion = version;
  }

  public updateSchemaVersion(version: number): void {
    this._model.schemaVersion = version;
  }

  public updateDimensions(dimensions: number): void {
    this._model.dimensions = dimensions;
  }

  public updateGeometryFileFormat(format: string): void {
    this._model.geometryFileFormat = format;
  }

  public updateGeometryFilename(filename: string): void {
    this._model.geometryFilename = filename;
  }

  public updateGridType(gridType: string): void {
    this._model.gridType = gridType;
  }

  public updateSimulationType(simulationType: string): void {
    this._model.simulationType = simulationType;
  }

  public updateSimulationDomain(simulationDomain: string): void {
    this._model.simulationDomain = simulationDomain;
  }

  public updateEquationStructure(equationStructure: string): void {
    this._model.equationStructure = equationStructure;
  }

  public updateInitialConditions(speed: number, density: number, viscosity: string): void {
    //this._model.initialConditions = { speed, density, viscosity };
  }

  public updateSolverType(solverType: string): void {
    this._model.solverType = solverType;
  }

  public updateIterationCount(iterationCount: number): void {
    this._model.iterationCount = iterationCount;
  }
*/

  // Called when user clicks Dimensions button

  public onClickDimensions(dimension: Dimensions): void {
    this._model.dimension = dimension;
  }

  public onClickShaderType(shaderType: ShaderType): void {
    this._model.shader = shaderType;
  }

  public onClickVertexFormat(vertexFormat: VertexFormat): void {
    this._model.vertex = vertexFormat;
  }

  public onClientNameChange(v: string) {
    this.model.setClientName(v);
  }

  public onClientEmailChange(v: string) {
    this.model.setClientEmail(v);
  }

  public onSpeedValueChange(v: number) {
    this.model.setSpeedValue(v);
  }

  public onSpeedUnitChange(u: SpeedUnit) {
    this.model.setSpeedUnit(u);
  }

  public onAccelerationValueChange(v: number) {
    this.model.setAccelerationValue(v);
  }

  public onAccelerationUnitChange(u: AccelerationUnit) {
    this.model.setAccelerationUnit(u);
  }

  public onGridNameChange(v: string) {
    this.model.setGridName(v);
  }   

  public onNbPointsChange(v: [number, number]) {
    this.model.setNbPoints(v);
  }

  public onStartCoordsChange(v: [number, number]) {
    this.model.setStartCoords(v);
  }

  public onEndCoordsChange(v: [number, number]) {
    this.model.setEndCoords(v);
  } 

  public onEqn_strChange(v: string) {
    this.model.setEqn_str(v);
  }

  public onVelocityChange(v: number) {
    this.model.setVelocity(v);
  }

  public onViscosityChange(v: number) {
    this.model.setViscosity(v);
  }


  public async onFileUpload(file: File) {
  try {
    //store file in model
    this.model.setUploadedFile(file);

    const formData = new FormData();
    formData.append("file", file);

    const userId = this.model.userId.getData();
    if (!userId) throw new Error("User ID is required for file upload");

      const response = await fetch(`http://localhost:3000/${userId}/geometry/loadfile`, {
        method: "POST",
        body: formData,
      });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();

    console.log("[Controller] File uploaded:", data);
    this.model.setOutputMessage("File uploaded successfully");

  } catch (err) {
    console.error("[Controller] Upload error:", (err as Error).message);
    this.model.setOutputMessage("File upload failed");
  }
}

  /*
  public updateShaderType(shaderType: ShaderType): void{
    this._model.shaderType = shaderType;
  }


  public updateVertexFormat(vertexFormat: VertexFormat): void{
    this._model.vertexFormat = vertexFormat;
  }

*/

// CLIENT SUBMISSION
//Sends client information to the backend server.

  public async submitClient() {
    try {
      const name = this._model.clientName.getData();
      const email = this._model.clientEmail.getData();

      if (!name || !email) {
        throw new Error("Client name and email are required");
      }

      console.log("[Controller] Submitting client:", { name, email });

      this._model.setOutputMessage("Submitting client...");

      // Send POST request to server to create new client
      const created = await serverRequest({
        method: "POST",
        endpoint: "/user/createnew",
        body: { name, email },
      });

      console.log("[Controller] Client created:", created);
      this._model.setOutputMessage(`Client "${created.name}" successfully created.`);

      // Store the userId for future requests
      if (created.userID) {
        this._model.userId.setData(created.userID);
      }
    } catch (err) {
      console.error("[Controller] Submit failed:", (err as Error).message);
      this._model.setOutputMessage(`Submit failed: ${(err as Error).message}`);
    }
  }

  submitPhysicalParams() {
    const speed = this._model.speedValue.getData();
    const speedUnit = this._model.speedUnit.getData();

    const acceleration = this._model.accelerationValue.getData();
    const accelerationUnit = this._model.accelerationUnit.getData();

    if (speed == null || Number.isNaN(speed)) {
      console.error("[Controller] Speed value is required");
      this._model.setOutputMessage("Speed value is required.");
      return;
    }

    if (!speedUnit) {
      console.error("[Controller] Speed unit is required");
      this._model.setOutputMessage("Speed unit is required.");
      return;
    }

    if (acceleration == null || Number.isNaN(acceleration)) {
      console.error("[Controller] Acceleration value is required");
      this._model.setOutputMessage("Acceleration value is required.");
      return;
    }

    if (!accelerationUnit) {
      console.error("[Controller] Acceleration unit is required");
      this._model.setOutputMessage("Acceleration unit is required.");
      return;
    }

    console.log("[Controller] Physical Params submitted:", {
      speed,
      speedUnit,
      acceleration,
      accelerationUnit,
    });
    
    this._model.setOutputMessage(
      ` Physical Parameters Submitted:
       Speed: ${speed} (${speedUnit})
       Acceleration: ${acceleration} (${accelerationUnit})`
    );
  }

  public async submitGrid() {
    try {
      const userId = this._model.userId.getData();
      if (!userId) {
        throw new Error("User ID not set: create a client first");
      }

      const result = await serverRequest({
        method: "POST",
        endpoint: `/${userId}/grid/block`,
        body: {
          name: this._model.gridName.getData(),
          nb_points: this._model.nbPoints.getData(),
          start_coords: this._model.startCoords.getData(),
          end_coords: this._model.endCoords.getData()
        }
      });

      this._model.setOutputMessage("Grid created");
      console.log(result);
    } catch (err) {
      console.error("[Controller] submitGrid failed:", (err as Error).message);
      this._model.setOutputMessage(`Grid create failed: ${(err as Error).message}`);
    }
  }

  public async submitEqnStr(){
    try {
      const userId = this._model.userId.getData();  
      if (!userId) {
        throw new Error("User ID not set: create a client first");
      }
      
      const eqn_str = await serverRequest({
        method: "POST",
        endpoint: `/${userId}/lb_solver/eqn`,
        body: { eqn_str: this._model.eqn_str.getData() }
      });
      this._model.setOutputMessage("Equation string submitted");
    } catch (err) {
      console.error("[Controller] submitEqnStr failed:", (err as Error).message);
      this._model.setOutputMessage(`Equation string submission failed: ${(err as Error).message}`);
    }
  }

  public async submitInitialConditions(){
    try {
      const userId = this._model.userId.getData();  
      if (!userId) {
        throw new Error("User ID not set: create a client first");
      }   

      const initialConditions = await serverRequest({
        method: "POST",
        endpoint: `/${userId}/lb_solver/initial_conditions`,
        body: {
          velocity: this._model.velocity.getData(),
          viscosity: this._model.viscosity.getData()
        }
      });

      this._model.setOutputMessage("Initial conditions submitted");
    }
    catch (err) {
      console.error("[Controller] submitInitialConditions failed:", (err as Error).message);
      this._model.setOutputMessage(`Initial conditions submission failed: ${(err as Error).message}`);
    }   
  }

}
