
// import { Speed, SpeedUnit } from './quantities'
// import { Density, DensityUnit } from './quantities'

import { Dimensions, ShaderType, VertexFormat } from '../m/modelEnums.js';
import { DimObserver, ShaderObserver, VertexObserver } from '../m/modelObserver.js';

export class ModelSimEngine {

  public dimension: ModelDim;
  public shader: ModelShader;
  public vertex: ModelVertex;
  
  constructor() {
    this.dimension = new ModelDim();
    this.shader = new ModelShader();
    this.vertex = new ModelVertex();
  }

  public setDimension(dim: Dimensions): void {
    this.dimension.setDimension(dim);
  }

  public setShader(shader: ShaderType): void {
    this.shader.setShader(shader);
  }

  public setVertexFormat(vertex: VertexFormat): void {
    this.vertex.setVertexFormat(vertex);
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

}


export class ModelDim {

    public dimension!: Dimensions;
    public observers: DimObserver[] = [];

    public register(obs: DimObserver){

      this.observers.push(obs);

    }

    public notify(){

      console.log(`[ModelDim] notifying observers...`);

      for (const obs of this.observers){

        obs.update(this.dimension);

      }

    }
    public setDimension(dim: Dimensions){
      
      this.dimension = dim;
      console.log(`ModelDim: Dimension set to" ${dim}`);
      this.notify();

    }
  

  }

  export class ModelShader {

  public shaderType!: ShaderType;
  private observers: ShaderObserver[] = [];

  register(obs: ShaderObserver) {
    this.observers.push(obs);
  }

  notify() {
    for (const obs of this.observers){
      obs.update(this.shaderType);
    }
  }

  setShader(shader: ShaderType) {
    this.shaderType = shader;
    console.log(`ModelShader: Shader set to ${shader}`);
    this.notify();
  }
}

  

  export class ModelVertex{

    public vertexFormat!: VertexFormat;
    public observers: VertexObserver[] = [];

    public register(obs: VertexObserver) {

      this.observers.push(obs);

    }


    public notify() {

      for (const obs of this.observers) {   

        obs.update(this.vertexFormat);

      }   
    }
    public setVertexFormat(vertex: VertexFormat) {

      this.vertexFormat = vertex;
      console.log(`ModelVertex: Vertex set to ${vertex}`);
      this.notify();  

    }


  }