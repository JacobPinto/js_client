import { SpeedUnit, AccelerationUnit } from "./quantities.js";
// import { Density, DensityUnit } from './quantities'

import { ModelGeneric } from "../m/modelGeneric.js";
import { Dimensions, ShaderType, VertexFormat } from "../m/modelEnums.js";

export class ModelSimEngine {
  // The smaller models help to build the larger simulation model.
  private _dimension: ModelGeneric<Dimensions>;
  private _shader: ModelGeneric<ShaderType>;
  private _vertex: ModelGeneric<VertexFormat>;

  // new form fields
  private _clientName = new ModelGeneric<string>();
  private _clientEmail = new ModelGeneric<string>();
  private _userId = new ModelGeneric<string>();

  private _speedValue = new ModelGeneric<number>();
  private _speedUnit = new ModelGeneric<SpeedUnit>();

  private _accelerationValue = new ModelGeneric<number>();
  private _accelerationUnit = new ModelGeneric<AccelerationUnit>();

  private _outputMessage = new ModelGeneric<string>();

  private _uploadedFile = new ModelGeneric<File>();

  // Grid params.
  private _gridId = new ModelGeneric<number>();
  private _blockId = new ModelGeneric<number>();
  private _nbPoints = new ModelGeneric<[number, number]>();
  private _startCoords = new ModelGeneric<[number, number]>();
  private _endCoords = new ModelGeneric<[number, number]>();
  private _grids = new ModelGeneric<any[]>();

  // LB Solver params.
  private _lbId = new ModelGeneric<number>();
  private _eqn_str = new ModelGeneric<string>();
  private _velocity = new ModelGeneric<number>();
  private _viscosity = new ModelGeneric<number>();
  private _bcType = new ModelGeneric<string>();
  private _bcData = new ModelGeneric<number>();
  private _bcNorm = new ModelGeneric<number>();
  private _run = new ModelGeneric<number>();

  constructor() {
    this._dimension = new ModelGeneric<Dimensions>();
    this._shader = new ModelGeneric<ShaderType>();
    this._vertex = new ModelGeneric<VertexFormat>();
  }

  // Getters
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

  public get userId(): ModelGeneric<string> {
    return this._userId;
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

  public get uploadedFile() {
    return this._uploadedFile;
  }

  public get gridId() {
    return this._gridId;
  }

  public get blockId() {
    return this._blockId;
  }

  public get lbId() {
    return this._lbId;
  }

  public get nbPoints() {
    return this._nbPoints;
  }

  public get startCoords() {
    return this._startCoords;
  }

  public get endCoords() {
    return this._endCoords;
  }

  public get eqn_str() {
    return this._eqn_str;
  }

  public get velocity() {
    return this._velocity;
  }

  public get viscosity() {
    return this._viscosity;
  }

  public get bcType() {
    return this._bcType;
  }

  public get bcData() {
    return this._bcData;
  }

  public get bcNorm() {
    return this._bcNorm;
  }

  public get run() {
    return this._run;
  }

  // Setters
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

  public setUploadedFile(file: File) {
    console.log("[Model] File uploaded:", file.name);
    this._uploadedFile.setData(file);
  }

  public setGridId(id: number) {
    this._gridId.setData(id);
  }

  public setBlockId(id: number) {
    this._blockId.setData(id);
  }

  public setLbId(id: number) {
    this._lbId.setData(id);
  }

  public setNbPoints(nbPoints: [number, number]) {
    this._nbPoints.setData(nbPoints);
  }

  public setStartCoords(coords: [number, number]) {
    this._startCoords.setData(coords);
  }

  public setEndCoords(coords: [number, number]) {
    this._endCoords.setData(coords);
  }

  public setEqn_str(eqn_str: string) {
    this._eqn_str.setData(eqn_str);
  }

  public setVelocity(velocity: number) {
    this._velocity.setData(velocity);
  }

  public setViscosity(viscosity: number) {
    this._viscosity.setData(viscosity);
  }

  public setBcType(bcType: string) {
    this._bcType.setData(bcType);
  }

  public setBcData(bcData: number) {
    this._bcData.setData(bcData);
  }

  public setBcNorm(bcNorm: number) {
    this._bcNorm.setData(bcNorm);
  }

  public setRun(run: number) {
    this._run.setData(run);
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
