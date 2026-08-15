import {
  InputElement,
  RadioButton,
  TextEntryWithButton,
  TextEntryWithDropdownAndButton,
  FileEntry,
  Dropdown,
} from "./button.js";
import { ButtonBuilder } from "./buttonBuilder.js";
import { Toolbar } from "./toolbar.js";
import { Workbench } from "./workbench.js";
import { Canvas } from "./canvas.js";
import { OverlayPanel } from "./overlayPanel.js";
import { Dimensions, ShaderType, VertexFormat } from "../m/modelEnums.js";
import { SpeedUnit, AccelerationUnit } from "../m/quantities.js";
import { OutputPanel } from "./outputPanel.js";
import { MouseHelpPanel } from "./mouseHelpPanel.js";
import { BottomPanel } from "./bottomPanel.js";
import { ControllerSimEngine } from "../c/controllerSimEngine.js";

export class ViewSimEngine {
  private _workbench: Workbench;
  private _buttons: InputElement[] = [];
  private _canvas: Canvas | null = null;
  private _output: OutputPanel | null = null;
  private _log: OutputPanel | null = null;
  private _mouseHelp: MouseHelpPanel | null = null;
  private _bottomPanel: BottomPanel | null = null;
  private _overlay: OverlayPanel | null = null;

  constructor(controller: ControllerSimEngine) {
    // Create ButtonBuilder
    let buttonBuilder = new ButtonBuilder(controller);

    //  Dimensions Button
    const dimensionsButton = buttonBuilder
      .setButtonType(RadioButton)
      .setButtonName("Dimensions")
      .setButtonDisplayName("Dimensions")
      .setQuestions({ d2: Dimensions.D2, d3: Dimensions.D3 })
      .setOnClick(function (this: RadioButton) {
        const selected = this.getValue() as Dimensions;
        this._controller?.onClickDimensions(selected);
      })
      .build() as RadioButton;

    //  Shader Button
    const shaderButton = buttonBuilder
      .setButtonType(RadioButton)
      .setButtonName("ShaderType")
      .setButtonDisplayName("Shader")
      .setQuestions({ flat: ShaderType.Flat, smooth: ShaderType.Smooth })
      .setOnClick(function (this: RadioButton) {
        const selected = this.getValue() as ShaderType;
        this._controller?.onClickShaderType?.(selected);
      })
      .setUpdate(function (this: RadioButton, dim: Dimensions) {
        if (!this._controller) return;
        if (!this._form) return;

        console.log(`[ShaderButton] Reacting to dimension: ${dim}`);
        const radios = this._form.querySelectorAll(
          'input[type="radio"]',
        ) as NodeListOf<HTMLInputElement>;
        const targetShader =
          dim === Dimensions.D2 ? ShaderType.Flat : ShaderType.Smooth;

        radios.forEach((r) => {
          r.disabled = false;
          if (r.value === targetShader) {
            r.checked = true;
            this._controller.onClickShaderType(targetShader);
            console.log(`Shader auto-selected: ${targetShader}`);
          } else if (dim === Dimensions.D2 && r.value === ShaderType.Smooth) {
            r.disabled = true;
          }
        });
      })
      .build() as RadioButton;

    // Vertex Button
    const vertexButton = buttonBuilder
      .setButtonType(RadioButton)
      .setButtonName("VertexFormat")
      .setButtonDisplayName("Vertex Format")
      .setQuestions({
        list: VertexFormat.List,
        strip: VertexFormat.Strip,
        index: VertexFormat.Index,
      })
      .setOnClick(function (this: RadioButton) {
        const selected = this.getValue() as VertexFormat;
        this._controller?.onClickVertexFormat?.(selected);
      })
      .build() as RadioButton;

    // Client Form Button
    const clientForm = buttonBuilder
      .setButtonType(TextEntryWithButton)
      .setButtonName("ClientForm")
      .setButtonDisplayName("Create Client")
      .setSubmitLabel("Submit")
      .setQuestions({
        name: "Client Name",
        email: "Client Email",
      })
      .setUpdate(function (this: TextEntryWithButton) {
        const name = this.getFieldValue("name");
        const email = this.getFieldValue("email");

        if (name) this._controller.onClientNameChange(name);
        if (email) this._controller.onClientEmailChange(email);
      })
      .setOnClick(function (this: TextEntryWithButton, e: Event) {
        e.preventDefault();
        this._controller.submitClient();
      })
      .build();

    const physicalParams = buttonBuilder
      .setButtonType(TextEntryWithDropdownAndButton)
      .setButtonName("PhysicalParams")
      .setButtonDisplayName("Physical Params")
      .setSubmitLabel("Submit")
      .setQuestions({
        speed: "Speed",
        acceleration: "Acceleration",
      })
      .setContextObj({
        speed: {
          options: {
            kmh: "Km/h",
            ms: "m/s",
            mph: "mph",
          },
        },
        acceleration: {
          options: {
            ms2: "m/s^2",
            cms2: "cm/s^2",
            mis2: "mi/hr^2",
          },
        },
      })
      .setUpdate(function (this: TextEntryWithDropdownAndButton) {
        const speed = Number(this.getTextValue("speed"));
        const speedUnit = this.getDropdownValue("speed");

        const acc = Number(this.getTextValue("acceleration"));
        const accUnit = this.getDropdownValue("acceleration");

        if (!Number.isNaN(speed)) {
          this._controller.onSpeedValueChange(speed);
        }

        if (!Number.isNaN(acc)) {
          this._controller.onAccelerationValueChange(acc);
        }

        // map units here if needed
        const speedUnitMap: Record<string, SpeedUnit> = {
          kmh: SpeedUnit.KmPerHour,
          ms: SpeedUnit.MeterPerSecond,
          mph: SpeedUnit.MilePerHour,
        };
        const accUnitMap: Record<string, AccelerationUnit> = {
          ms2: AccelerationUnit.MeterPerSecondSquared,
          cms2: AccelerationUnit.CmPerSecondSquared,
          mis2: AccelerationUnit.MilePerHourSquared,
        };

        this._controller.onSpeedUnitChange(speedUnitMap[speedUnit]);
        this._controller.onAccelerationUnitChange(accUnitMap[accUnit]);
      })
      .setOnClick(function (this: TextEntryWithDropdownAndButton) {
        this._controller.submitPhysicalParams();
      })
      .build();

    const loadfilebutton = buttonBuilder
      .setButtonType(FileEntry)
      .setButtonName("LoadFile")
      .setButtonDisplayName("Load File")
      .setQuestions({
        file: "Select a file",
      })
      .setOnClick(function (this: FileEntry, file?: File) {
        if (file) {
          this._controller.onFileUpload(file);
        } else {
          console.warn("No file selected.");
        }
      })
      .build();

    const gridButton = buttonBuilder
      .setButtonType(TextEntryWithButton)
      .setButtonName("CreateGrid")
      .setButtonDisplayName("Create Grid")
      .setSubmitLabel("Create")
      .setQuestions({
        gridId: "Grid ID",
        blockId: "Block ID",
        nbx: "Nb Points X",
        nby: "Nb Points Y",
        startx1: "Start X",
        starty1: "Start Y",
        endx2: "End X",
        endy2: "End Y",
      })

      .setUpdate(function (this: TextEntryWithButton) {
        const gridId = Number(this.getFieldValue("gridId"));
        const blockId = Number(this.getFieldValue("blockId"));

        const nbx = Number(this.getFieldValue("nbx"));
        const nby = Number(this.getFieldValue("nby"));

        const x1 = Number(this.getFieldValue("startx1"));
        const y1 = Number(this.getFieldValue("starty1"));

        const x2 = Number(this.getFieldValue("endx2"));
        const y2 = Number(this.getFieldValue("endy2"));

        if (!Number.isNaN(gridId)) {
          this._controller.onGridIdChange(gridId);
        }

        if (!Number.isNaN(blockId)) {
          this._controller.onBlockIdChange(blockId);
        }

        if (!Number.isNaN(nbx) && !Number.isNaN(nby)) {
          this._controller.onNbPointsChange([nbx, nby]);
        }

        if (!Number.isNaN(x1) && !Number.isNaN(y1)) {
          this._controller.onStartCoordsChange([x1, y1]);
        }

        if (!Number.isNaN(x2) && !Number.isNaN(y2)) {
          this._controller.onEndCoordsChange([x2, y2]);
        }
      })

      .setOnClick(function (this: TextEntryWithButton, e: Event) {
        e.preventDefault();
        this._controller.submitGrid();
      })

      .build();

    const solverButton = buttonBuilder
      .setButtonType(TextEntryWithButton)
      .setButtonName("CreateSolver")
      .setButtonDisplayName("Create Solver")
      .setSubmitLabel("Create")
      .setQuestions({
        lbId: "LB Solver ID",
      })
      .setUpdate(function (this: TextEntryWithButton) {
        const lbId = Number(this.getFieldValue("lbId"));
        if (!Number.isNaN(lbId)) {
          this._controller.onLbIdChange(lbId);
        }
      })
      .setOnClick(function (this: TextEntryWithButton, e: Event) {
        e.preventDefault();
        const lbId = Number(this.getFieldValue("lbId"));

        if (Number.isNaN(lbId)) {
          console.error("Invalid lbId");
          return;
        }
        this._controller.onLbIdChange(lbId);
        this._controller.createSolver();
      })
      .build();

    const initialConditionsButton = buttonBuilder
      .setButtonType(TextEntryWithButton)
      .setButtonName("InitialConditions")
      .setButtonDisplayName("Initial Conditions")
      .setSubmitLabel("Submit")
      .setQuestions({
        velocity: "Velocity",
        viscosity: "Viscosity",
      })
      .setUpdate(function (this: TextEntryWithButton) {
        const velocity = Number(this.getFieldValue("velocity"));
        const viscosity = Number(this.getFieldValue("viscosity"));

        if (!Number.isNaN(velocity)) {
          this._controller.onVelocityChange(velocity);
        }

        if (!Number.isNaN(viscosity)) {
          this._controller.onViscosityChange(viscosity);
        }
      })
      .setOnClick(function (this: TextEntryWithButton, e: Event) {
        e.preventDefault();
        this._controller.submitInitialConditions();
      })
      .build();

    const eqbutton1 = buttonBuilder
      .setButtonType(TextEntryWithButton)
      .setButtonName("Equation")
      .setButtonDisplayName("Equation String")
      .setSubmitLabel("Submit")
      .setQuestions({
        eqn_str: "Equation String",
      })
      .setUpdate(function (this: TextEntryWithButton) {
        const eqn_str = this.getFieldValue("eqn_str");
        if (eqn_str) {
          this._controller.onEqn_strChange(eqn_str);
        }
      })
      .setOnClick(function (this: TextEntryWithButton, e: Event) {
        e.preventDefault();
        this._controller.submitEqnStr();
      })
      .build();

    const boundaryConditionButton = buttonBuilder
      .setButtonType(TextEntryWithDropdownAndButton)
      .setButtonName("BoundaryConditions")
      .setButtonDisplayName("Boundary Conditions")
      .setSubmitLabel("Submit")

      .setQuestions({
        bcId: "Boundary Condition ID",
        type: "Type",
        norm: "Normal",
        data: "Data",
      })

      .setContextObj({
        bcId: {},
        type: {
          options: {
            constant_velocity_wall: "Constant Velocity Wall",
            bounce_back: "Bounce Back",
          },
        },
        norm: {},
        data: {},
      })

      .setUpdate(function (this: TextEntryWithDropdownAndButton) {
        const bcId = this.getTextValue("bcId");
        const type = this.getDropdownValue("type");
        const norm = this.getTextValue("norm");
        const data = this.getTextValue("data");

        // Helper parser
        const parseVector = (value: string): number[] => {
          return value
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v !== "")
            .map((v) => {
              const num = Number(v);

              if (isNaN(num)) {
                throw new Error(`Invalid vector value: ${v}`);
              }

              return num;
            });
        };

        // Hide/show data field
        const rows = this._form.querySelectorAll("div");
        const dataRow = rows[3];

        if (dataRow) {
          (dataRow as HTMLElement).style.display =
            type === "constant_velocity_wall" ? "flex" : "none";
        }

        // Boundary condition id
        if (bcId && !Number.isNaN(Number(bcId))) {
          this._controller.onBcIdChange(Number(bcId));
        }

        // Boundary type
        if (type) {
          this._controller.onBcTypeChange(type);
        }

        // Normal vector
        if (norm) {
          this._controller.onBcNormChange(parseVector(norm));
        }

        // Data vector
        if (type === "constant_velocity_wall" && data) {
          this._controller.onBcDataChange(parseVector(data));
        }
      })

      .setOnClick(function (this: TextEntryWithDropdownAndButton) {
        this._controller.submitBoundaryConditions();
      })

      .build();

    const runButton = buttonBuilder
      .setButtonType(TextEntryWithButton)
      .setButtonName("Run")
      .setButtonDisplayName("Run Simulation")
      .setSubmitLabel("Run")
      .setQuestions({
        run: "Run",
      })
      .setUpdate(function (this: TextEntryWithButton) {
        const run = Number(this.getFieldValue("run"));
        if (!Number.isNaN(run)) {
          this._controller.onRunChange(run);
        }
      })
      .setOnClick(function (this: TextEntryWithButton, e: Event) {
        e.preventDefault();
        this._controller.submitRun();
      })
      .build();

    // Create canvas and wire state changes to controller
    // Canvas displays server-rendered output.jpeg and captures mouse interactions
    this._canvas = new Canvas();
    this._canvas.onStateChange((state) => {
      // When user interacts with canvas (pan/zoom/rotate), send state to controller
      // Controller will POST to /camera endpoint, which writes camera.json
      // Server render engine reads camera.json and generates new output.jpeg
      controller.onCameraStateChange(state);
    });

    // Create overlay panel for displaying forms on top of canvas
    this._overlay = new OverlayPanel();

    // Create toolbars
    const grid = new Toolbar("Grid", [gridButton]);

    const geometry = new Toolbar("Geometry", [loadfilebutton]);

    const LBSolver = new Toolbar("LB Solver", [
      initialConditionsButton,
      boundaryConditionButton,
      eqbutton1,
      runButton,
      clientForm,
      solverButton,
    ]);


    // Output panel
    this._output = new OutputPanel("Output");

    // Log panel
    this._log = new OutputPanel("Log");

    // Mouse help panel
    this._mouseHelp = new MouseHelpPanel();

    // Bottom dock
    this._bottomPanel = new BottomPanel(
      this._output,
      this._mouseHelp,
      this._log,
    );

    // Create workbench with canvas and overlay
    this._workbench = new Workbench(
      "mainWorkbench",
      [geometry, grid, LBSolver],
      this._canvas,
      this._overlay,
      this._bottomPanel
    );

    // register output as observer for model notifications
    controller.model.outputMessage.register(this._output);
  } // end constructor

  render(): void {
    const root = document.getElementById("app");
    if (root) {
      const container = document.createElement("div");
      container.className = "flex h-screen w-full flex-col overflow-hidden";

      container.appendChild(this._workbench.getElement());
      root.appendChild(container);
    }
  }
}
