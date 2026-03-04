import { Dimensions, ShaderType, VertexFormat } from "../m/modelEnums.js";
import { SpeedUnit, AccelerationUnit } from "../m/quantities.js";

import { ModelSimEngine } from "../m/modelSimEngine.js";
import { ViewSimEngine } from "../v/viewSimEngine.js";

// Local function to create client via server
async function createClient(
  baseUrl: string,
  data: { name: string; email: string },
) {
  const response = await fetch(`${baseUrl}/client`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * ControllerSimEngine
 * 
 * MVC Controller that manages interactions between the View and Model.
 * Handles user input events, validates data, and coordinates model updates.
 * Acts as an intermediary that processes view events and updates the simulation model.
 */
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

  // Handle input changes for client details

  public onClientNameChange(v: string) {
    this.model.setClientName(v);
  }

  public onClientEmailChange(v: string) {
    this.model.setClientEmail(v);
  }


  // Handle input changes for speed and acceleration values/units

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

  /*
  public updateShaderType(shaderType: ShaderType): void{
    this._model.shaderType = shaderType;
  }


  public updateVertexFormat(vertexFormat: VertexFormat): void{
    this._model.vertexFormat = vertexFormat;
  }

*/

  // SUBMISSION HANDLERS 
  // Handle form submissions and data processing

  /**
   * Submits client information to the backend server.
   * Validates client name and email, sends HTTP POST request, and updates output message.
   * Handles errors with user-friendly feedback.
   */
  public async submitClient() {
    try {
      const name = this._model.clientName.getData();
      const email = this._model.clientEmail.getData();

      if (!name || !email) {
        throw new Error("Client name and email are required");
      }

      console.log("[Controller] Submitting client:", { name, email });

      this._model.setOutputMessage("Submitting client...");

      const created = await createClient("http://localhost:3001", {
        name,
        email,
      });

      console.log("[Controller] Client created:", created);
      this._model.setOutputMessage(`Client "${created.name}" successfully created.`);
    } catch (err) {
      console.error("[Controller] Submit failed:", (err as Error).message);
      this._model.setOutputMessage(`Submit failed: ${(err as Error).message}`);
    }
  }

  /*

   * Submits physical parameters (speed and acceleration with units).
   * Validates all required fields and provides error feedback.
   * Updates the model output message with submission status or error details.
   * 
   */
  submitPhysicalParams() {
    const speed = this._model.speedValue.getData();
    const speedUnit = this._model.speedUnit.getData();

    const acceleration = this._model.accelerationValue.getData();
    const accelerationUnit = this._model.accelerationUnit.getData();

    //Speed value must be a valid number
    if (speed == null || Number.isNaN(speed)) {
      console.error("[Controller] Speed value is required");
      this._model.setOutputMessage("Speed value is required.");
      return;
    }

    //Speed unit must be selected
    if (!speedUnit) {
      console.error("[Controller] Speed unit is required");
      this._model.setOutputMessage("Speed unit is required.");
      return;
    }

    // Acceleration value must be a valid number
    if (acceleration == null || Number.isNaN(acceleration)) {
      console.error("[Controller] Acceleration value is required");
      this._model.setOutputMessage("Acceleration value is required.");
      return;
    }

    // Acceleration unit must be selected
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
}
