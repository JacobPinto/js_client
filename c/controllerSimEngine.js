export class ControllerSimEngine {
    constructor(model, view) {
        this._model = model;
        this._view = view;
    }
    initialize() {
        this._view.render();
    }
    updateSoftwareVersion(version) {
        this._model.softwareVersion = version;
    }
    updateSchemaVersion(version) {
        this._model.schemaVersion = version;
    }
    updateDimensions(dimensions) {
        this._model.dimensions = dimensions;
    }
    updateGeometryFileFormat(format) {
        this._model.geometryFileFormat = format;
    }
    updateGeometryFilename(filename) {
        this._model.geometryFilename = filename;
    }
    updateGridType(gridType) {
        this._model.gridType = gridType;
    }
    updateSimulationType(simulationType) {
        this._model.simulationType = simulationType;
    }
    updateSimulationDomain(simulationDomain) {
        this._model.simulationDomain = simulationDomain;
    }
    updateEquationStructure(equationStructure) {
        this._model.equationStructure = equationStructure;
    }
    updateInitialConditions(speed, density, viscosity) {
        //this._model.initialConditions = { speed, density, viscosity };
    }
    updateSolverType(solverType) {
        this._model.solverType = solverType;
    }
    updateIterationCount(iterationCount) {
        this._model.iterationCount = iterationCount;
    }
}
//# sourceMappingURL=controllerSimEngine.js.map