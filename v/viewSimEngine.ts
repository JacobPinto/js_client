import {
  InputElement,
  RadioButton,
  TextEntryWithButton,
  TextEntryWithDropdownAndButton,
  FileEntry,
} from "./button.js";
import { ButtonBuilder } from "./buttonBuilder.js";
import { Toolbar } from "./toolbar.js";
import { Workbench } from "./workbench.js";
import { Dimensions, ShaderType, VertexFormat } from "../m/modelEnums.js";
import { SpeedUnit, AccelerationUnit } from "../m/quantities.js";
import { Output } from "./output.js";
import { ControllerSimEngine } from "../c/controllerSimEngine.js";

export class ViewSimEngine {
  private _workbench: Workbench;
  private _buttons: InputElement[] = [];

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
        name: "Grid Name",
        nbx: "Nb Points X",
        nby: "Nb Points Y",
        startx1: "Start X",
        starty1: "Start Y",
        endx2: "End X",
        endy2: "End Y",
      })

      .setUpdate(function (this: TextEntryWithButton) {
        const name = this.getFieldValue("name");

        const nbx = Number(this.getFieldValue("nbx"));
        const nby = Number(this.getFieldValue("nby"));

        const x1 = Number(this.getFieldValue("startx1"));
        const y1 = Number(this.getFieldValue("starty1"));

        const x2 = Number(this.getFieldValue("endx2"));
        const y2 = Number(this.getFieldValue("endy2"));

        if (name) this._controller.onGridNameChange(name);

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

    // Register observers
    controller.model.dimension.register(shaderButton);

    // Store buttons
    this._buttons.push(dimensionsButton, shaderButton, vertexButton);

    // // small toolbar
    // const smallToolbar = new Toolbar(" Toolbar 1", [
    //   shaderButton,
    //   clientForm,
    //   dimensionsButton,
    //     uploadbutton,
    // ]);

    const grid = new Toolbar("Grid", [ 
      gridButton,
    ]);

    const geometry = new Toolbar("Geometry", [
      loadfilebutton,
    ]);

    const LBSolver = new Toolbar("LB Solver", [
      initialConditionsButton,
      eqbutton1,
      clientForm,
    ]);

    // Create workbench
    this._workbench = new Workbench("mainWorkbench", [
      geometry,
      grid,
      LBSolver,
    ]);

    const output = new Output();

    // register as observer
    controller.model.outputMessage.register(output);

    // append to UI
    this._workbench.getElement().appendChild(output.getElement());
  } // end constructor

  render(): void {
    const root = document.getElementById("app");
    if (root) {
      root.appendChild(this._workbench.getElement());
    }
  }
}
