
import { Speed, SpeedUnit } from './quantities'
import { Density, DensityUnit } from './quantities'

export class ModelSimEngine {

  public dimension: ModelDim;
  public shader: ModelShader;
  public vertex: ModelVertex;
  

  constructor(){
    this.dimension = new ModelDim();
    this.shader = new ModelShader();
    this.vertex = new ModelVertex();
  }

  public setDimension(dim: Dimensions): void {
    this.dimension.setDimension(dim);
  }

  public setShader(shader: ShaderType): void {

    this.shader.setShader(shader);
    
    //shader affects Dimension
    if (shader === ShaderType.Flat) {
      this.setDimension(Dimensions.D2);
    } else if (shader === ShaderType.Smooth) {
      this.setDimension(Dimensions.D3);
    }

  }

  public setVertexFormat(vertex: VertexFormat): void {
    this.vertex.setVertexFormat(vertex);
  }

  public color!: Color;
  

  
  // Software params.
  public softwareVersion!: number;
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
  public equationStructure!: string;

  // Flow properties
  public initialConditions!: {
    speed: Speed,
    density: Density,
    viscosity: string
  };

  // Numerical properties.
  public solverType!: string;
  public iterationCount!: number;

  // Boundary conds.
  //SlipWall
  //ConstantVelocityWall
  //ExtrapolationOutflow
  //class BounceBack {
  //  public a: number;
  //}

}
// dimension observer interfave
// update method should be in the viewsimengine #TBD

// Observer interfaces

export interface DimObserver {

  update(dimension: Dimensions): void;

}

// shader observer interface
export interface ShaderObserver {
  
  update(shader: ShaderType): void;

}

// vertex format observer interface
export interface VertexObserver {

  update(vertex: VertexFormat): void;

}


export class ModelDim {

    public dimension!: Dimensions;
    public observers: DimObserver[] = [];

    public register(obs: DimObserver){

      this.observers.push(obs);

    }

    public notify(){

      for (const obs of this.observers){

        obs.update(this.dimension);

      }

    }
    public setDimension(dim: Dimensions){
      
      if (this.dimension === dim) return; // prevent duplicate log
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



// Enums

export enum Dimensions {

  D2 = "2D",
  D3 = "3D"

}

export enum Color {

  Red = "Red",
  Blue = "Blue",
  Green = "Green"

}

export enum ShaderType {

  Flat = "Flat",
  Smooth = "Smooth"

}

export enum VertexFormat {

  List = "List",
  Strip = "Strip",
  Index = "Index"

}
