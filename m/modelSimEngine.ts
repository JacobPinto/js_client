
// import { Speed, SpeedUnit } from './quantities'
// import { Density, DensityUnit } from './quantities'

import {ModelGeneric} from '../m/modelGeneric.js';
import { Dimensions, ShaderType, VertexFormat } from '../m/modelEnums.js';

export class ModelSimEngine {

  public dimension: ModelGeneric<Dimensions>;
  public shader: ModelGeneric<ShaderType>;
  public vertex: ModelGeneric<VertexFormat>;
  
  constructor() {
    this.dimension = new ModelGeneric<Dimensions>();
    this.shader = new ModelGeneric<ShaderType>();
    this.vertex = new ModelGeneric<VertexFormat>();
  }

  public setDimension(dim: Dimensions): void {
    this.dimension.setData(dim);
  }

  public setShader(shader: ShaderType): void {
    this.shader.setData(shader);
  }

  public setVertexFormat(vertex: VertexFormat): void {
    this.vertex.setData(vertex);
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