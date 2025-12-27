
// import { Speed, SpeedUnit } from './quantities'
// import { Density, DensityUnit } from './quantities'

import {ModelGeneric} from '../m/modelGeneric.js';
import { Dimensions, ShaderType, VertexFormat } from '../m/modelEnums.js';

export class ModelSimEngine {

  // The smaller models help to build the larger simulation model.
  private _dimension: ModelGeneric<Dimensions>;
  private _shader: ModelGeneric<ShaderType>;
  private _vertex: ModelGeneric<VertexFormat>;
  
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

  

  /*

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