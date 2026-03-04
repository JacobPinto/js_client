
import { SpeedUnit, AccelerationUnit } from './quantities.js'
// import { Density, DensityUnit } from './quantities'

import {ModelGeneric} from '../m/modelGeneric.js';
import { Dimensions, ShaderType, VertexFormat } from '../m/modelEnums.js';

/**
 * ModelSimEngine
 * 
 * Core simulation model that manages all simulation parameters and state.
 * Uses ModelGeneric to provide observable state management for each property.
 * This allows the View and Controller layers to subscribe to model changes.
 */
export class ModelSimEngine {

  // The smaller models help to build the larger simulation model.
  private _dimension: ModelGeneric<Dimensions>;
  private _shader: ModelGeneric<ShaderType>;
  private _vertex: ModelGeneric<VertexFormat>;

  // User information models
  private _clientName = new ModelGeneric<string>();
  private _clientEmail = new ModelGeneric<string>();

  // Physical parameters - Speed
  private _speedValue = new ModelGeneric<number>();
  private _speedUnit = new ModelGeneric<SpeedUnit>();

  // Physical parameters - Acceleration
  private _accelerationValue = new ModelGeneric<number>();
  private _accelerationUnit = new ModelGeneric<AccelerationUnit>();

  // Output 
  private _outputMessage = new ModelGeneric<string>();
  
  
  constructor() {
    this._dimension = new ModelGeneric<Dimensions>();
    this._shader = new ModelGeneric<ShaderType>();
    this._vertex = new ModelGeneric<VertexFormat>();

  }

  // GETTERS
  // Return the ModelGeneric wrappers to allow observers to subscribe to state changes

  public get dimension(): ModelGeneric<Dimensions> {
    return this._dimension;
  }

  public get shader(): ModelGeneric<ShaderType> {
    return this._shader;
  }

  public get vertex(): ModelGeneric<VertexFormat> {
    return this._vertex;
  }

  public get clientName(): ModelGeneric<string> {
    return this._clientName;
  }

  public get clientEmail(): ModelGeneric<string> {
    return this._clientEmail;
  }

  public get speedValue() {
    return this._speedValue;
  }
  
  public get speedUnit() {
    return this._speedUnit;
  }

  public get accelerationValue() {
    return this._accelerationValue;
  }

  public get accelerationUnit() {
    return this._accelerationUnit;
  }

  public get outputMessage() {
    return this._outputMessage;
  }


  // SETTERS 
  // Update model data and log changes 
  
  public set dimension(dim: Dimensions) {
    this._dimension.setData(dim);
  }

  public set shader(shader: ShaderType) {
    this._shader.setData(shader);
  }

  public set vertex(vertex: VertexFormat) {
    this._vertex.setData(vertex);
  }

  public setClientName(v: string) {
    console.log("[Model] clientName =", v);
    this._clientName.setData(v);
  }

  public setClientEmail(v: string) {
    console.log("[Model] clientEmail =", v);
    this._clientEmail.setData(v);
  }

  public setSpeedValue(v: number) {
    console.log("[Model] speedValue =", v);
    this._speedValue.setData(v);
  }

  public setSpeedUnit(u: SpeedUnit) {
    console.log("[Model] speedUnit =", u);
    this._speedUnit.setData(u);
  }

  public setAccelerationValue(v: number) {
    console.log("[Model] accelerationValue =", v);
    this._accelerationValue.setData(v);
  }   

  public setAccelerationUnit(u: AccelerationUnit) {
    console.log("[Model] accelerationUnit =", u);
    this._accelerationUnit.setData(u);
  } 

  public setOutputMessage(msg: string) {    
    this._outputMessage.setData(msg);
  }

  
  // Software params.
  /*public softwareVersion!: number;
  public schemaVersion!: number;

  // Physical params.
  public dimensions!: number;

  // Geometry params.
  public geometryFileFormat!: string;
  public geometryFilename!: string;

  // Grid params.
  public gridType!: string;

  // Simulation properties.
  public simulationType!: string;
  public simulationDomain!: string;
  public equationStructure!: string;*/

  // // Flow properties
  // public initialConditions!: {
  //   speed: Speed,
  //   density: Density,
  //   viscosity: string
  // };

  // Numerical properties.
  /*public solverType!: string;
  public iterationCount!: number;*/

  // Boundary conds.
  //SlipWall
  //ConstantVelocityWall
  //ExtrapolationOutflow
  //class BounceBack {
  //  public a: number;
  //}

} // end ModelSimEngine