import { Dimensions, ShaderType, VertexFormat } from '../m/modelEnums.js';

// dimension observer interfave
// update method should be in the viewsimengine #TBD

// Generic observer interface
export interface Observer<T> {
  update(value: T): void;
}

export type DimObserver = Observer<Dimensions>;
export type ShaderObserver = Observer<ShaderType>;
export type VertexObserver = Observer<VertexFormat>;


// observer interface can be one with update methoad and other will derive.
