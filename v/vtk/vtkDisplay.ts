import '@kitware/vtk.js/favicon';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';

export class VtkDisplay {
  private _fullScreenRenderer: any;

  constructor(containerId: string = 'vtk-container') {
    // Initialize vtk.js renderer
    const container =  document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id '${containerId}' not found.`);
    }

    this._fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      container: container,
      background: [0.1, 0.1, 0.2] // Dark blue background
    });

    const renderer = this._fullScreenRenderer.getRenderer();
    const renderWindow = this._fullScreenRenderer.getRenderWindow();

    // Create a simple cone
    const coneSource = vtkConeSource.newInstance({
      height: 2.0,
      radius: 1.0,
      resolution: 20
    });

    // Create mapper
    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(coneSource.getOutputPort());

    // Create actor
    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);
    actor.getProperty().setColor(1.0, 0.5, 0.2); // Orange color

    // Add to renderer
    renderer.addActor(actor);
    renderer.resetCamera();
    renderWindow.render();
  }
}