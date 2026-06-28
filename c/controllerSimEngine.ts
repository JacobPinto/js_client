import { Dimensions, ShaderType, VertexFormat } from "../m/modelEnums.js";
import { SpeedUnit, AccelerationUnit } from "../m/quantities.js";

import { ModelSimEngine } from "../m/modelSimEngine.js";
import { CameraState } from "../v/canvas.js";

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
  const response = await fetch(`http://localhost:4000${config.endpoint}`, {
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

  public onGridIdChange(id: number) {
    this.model.setGridId(id);
  }

  public onBlockIdChange(id: number) {
    this.model.setBlockId(id);
  }

  public onLbIdChange(id: number) {
    this.model.setLbId(id);
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

  public onBcIdChange(v: number) {
    this.model.setBcId(v);
  }

  public onBcTypeChange(v: string) {
    this.model.setBcType(v);
  }

  public onBcDataChange(v: number[]) {
    this.model.setBcData(v);
  }

  public onBcNormChange(v: number[]) {
    this.model.setBcNorm(v);
  }

  public onRunChange(v: number) {
    this.model.setRun(v);
  }

  public async onFileUpload(file: File) {
    try {
      //store file in model
      this.model.setUploadedFile(file);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`http://localhost:4000/geometry/loadfile`, {
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

  public async submitGrid() {
    try {
      const blockId = this._model.blockId.getData();

      const gridResult = await serverRequest({
        method: "POST",
        endpoint: `/grid`,
        body: {},
      });

      const gridId = gridResult.gridId;
      this._model.setGridId(gridId);

      const result = await serverRequest({
        method: "POST",
        endpoint: `/grid/${gridId}/block`,
        body: {
          blockId,
          nb_points: this._model.nbPoints.getData(),
          start_coords: this._model.startCoords.getData(),
          end_coords: this._model.endCoords.getData(),
        },
      });

      this._model.setOutputMessage("block added to grid");
      console.log(result);
    } catch (err) {
      console.error("[Controller] submit failed:", (err as Error).message);
      this._model.setOutputMessage(
        `Grid/block create failed: ${(err as Error).message}`,
      );
    }
  }

  // CREATE SOLVER
  public async createSolver() {
    try {

      const lbresult = await serverRequest({
        method: "POST",
        endpoint: `/lb_solver`,
        body: {},
      });

      const lbId = lbresult.lbId;
      this._model.setLbId(lbId);

      this._model.setOutputMessage(`Solver ${lbId} created`);
    } catch (err) {
      console.error(
        "[Controller] createSolver failed:",
        (err as Error).message,
      );
      this._model.setOutputMessage(`Create failed: ${(err as Error).message}`);
    }
  }

  public async submitEqnStr() {
    try {
      const lbId = this._model.lbId.getData();

      if (lbId == null) throw new Error("lbId missing");

      await serverRequest({
        method: "POST",
        endpoint: `/lb_solver/${lbId}/eqn_str`,
        body: { eqn_str: this._model.eqn_str.getData() },
      });

      this._model.setOutputMessage("Equation string submitted");
    } catch (err) {
      console.error(
        "[Controller] submitEqnStr failed:",
        (err as Error).message,
      );
      this._model.setOutputMessage(`Error: ${(err as Error).message}`);
    }
  }

  public async submitInitialConditions() {
    try {
      const lbId = this._model.lbId.getData();

      if (lbId == null) throw new Error("lbId missing");

      await serverRequest({
        method: "POST",
        endpoint: `/lb_solver/${lbId}/initial_conditions`,
        body: {
          velocity: this._model.velocity.getData(),
          viscosity: this._model.viscosity.getData(),
        },
      });

      this._model.setOutputMessage("Initial conditions submitted");
    } catch (err) {
      console.error(
        "[Controller] submitInitialConditions failed:",
        (err as Error).message,
      );
      this._model.setOutputMessage(`Error: ${(err as Error).message}`);
    }
  }

  public async submitBoundaryConditions() {
    try {
      const bcId = this._model.bcId.getData();
      const lbId = this._model.lbId.getData();

      if (lbId == null) throw new Error("lbId missing");

      await serverRequest({
        method: "POST",
        endpoint: `/lb_solver/${lbId}/boundary_condition`,
        body: {
          id: this._model.bcId.getData(),
          type: this._model.bcType.getData(),
          data: this._model.bcData.getData(),
          norm: this._model.bcNorm.getData(),
        },
      });

      this._model.setOutputMessage("Boundary condition added");
    } catch (err) {
      console.error(
        "[Controller] submitBoundaryConditions failed:",
        (err as Error).message,
      );
      this._model.setOutputMessage(`Error: ${(err as Error).message}`);
    }
  }

  public async submitRun() {
    try {
      const lbId = this._model.lbId.getData();

      if (lbId == null) throw new Error("lbId missing");

      await serverRequest({
        method: "POST",
        endpoint: `/lb_solver/${lbId}/run`,
        body: { iterationCount: this._model.run.getData() },
      });

      this._model.setOutputMessage("Run submitted");
    } catch (err) {
      console.error("[Controller] submitRun failed:", (err as Error).message);
      this._model.setOutputMessage(`Error: ${(err as Error).message}`);
    }
  }

  // CAMERA STATE HANDLING
  /**
   * Handle camera state changes from Canvas component
   * 
   * This implements Step 2 of the rendering pipeline:
   * Receives camera state (pan, zoom, rotate) from Canvas
   * Sends to server's /camera endpoint to write camera.json
   * @param state - CameraState from Canvas containing pan, zoom, rotate values
   */
  public async onCameraStateChange(state: CameraState): Promise<void> {
    try {
      const payload = {
        pan: {
          x: parseFloat(state.pan.x.toFixed(4)),
          y: parseFloat(state.pan.y.toFixed(4)),
        },
        zoom: parseFloat(state.zoom.toFixed(6)),
        rotate: {
          azimuth: parseFloat(state.rotate.azimuth.toFixed(4)),
          elevation: parseFloat(state.rotate.elevation.toFixed(4)),
        },
      };

      const response = await fetch("http://localhost:4000/camera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      this._model.setOutputMessage("Camera state updated");
    } catch (err) {
      console.error("[Controller] Camera update failed:", (err as Error).message);
      this._model.setOutputMessage(
        `Camera update failed: ${(err as Error).message}`,
      );
    }
  }
}
