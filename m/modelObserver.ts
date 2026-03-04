import { Dimensions, ShaderType, VertexFormat } from '../m/modelEnums.js';

// dimension observer interface
// update method should be in the viewsimengine #TBD

// Generic observer interface
export interface Observer {
  update(value: any): void;
}
