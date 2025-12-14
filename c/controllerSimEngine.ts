import { Dimensions, ShaderType, VertexFormat } from '../m/modelEnums.js';
import { ModelSimEngine } from '../m/modelSimEngine.js';
import { ViewSimEngine } from '../v/viewSimEngine.js';
export class ControllerSimEngine {

  private _model: ModelSimEngine;
  private _view?: ViewSimEngine;

  constructor(model: ModelSimEngine, view?: ViewSimEngine) {
    this._model = model;
    this._view = view;
  }

  public setView(view: ViewSimEngine): void {
    this._view = view;
  }

  public initialize(): void {
    this._view?.render();
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
    console.log(`[Controller] onClickDimensions(${dimension})`);
    this._model.setDimension(dimension as Dimensions);
  }

  public onClickShaderType(shaderType: ShaderType): void {
  this._model.setShader(shaderType as ShaderType);
  }

  public onClickVertexFormat(vertexFormat: VertexFormat): void {
    this._model.setVertexFormat(vertexFormat as VertexFormat);
  }

 


/*
  public updateShaderType(shaderType: ShaderType): void{
    this._model.shaderType = shaderType;
  }


  public updateVertexFormat(vertexFormat: VertexFormat): void{
    this._model.vertexFormat = vertexFormat;
  }

*/

}
