
import { Speed, SpeedUnit } from './quantities'
import { Density, DensityUnit } from './quantities'

export class ModelSimEngine {

  public dimension!: Dimensions;
  public color!: Color;
  public shaderType!: ShaderType;
  public vertexFormat!: VertexFormat;


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
