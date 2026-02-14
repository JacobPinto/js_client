//import { TextEntryWithButton, Checkbox, RadioButton, FileEntry, Dropdown, SimpleButton } from './button.js';
import {
  InputElement,
  RadioButton,
  TextEntryWithButton,
  TextEntryWithDropdownAndButton,
} from "./button.js";
import { ButtonBuilder } from "./buttonBuilder.js";
import { Toolbar } from "./toolbar.js";
import { Workbench } from "./workbench.js";
import { Dimensions, ShaderType, VertexFormat } from "../m/modelEnums.js";
import { SpeedUnit, AccelerationUnit } from "../m/quantities.js";
import { Output } from "./output.js";
import { ModelSimEngine } from "../m/modelSimEngine.js";
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

    // Register observers
    controller.model.dimension.register(shaderButton);

    // Store buttons
    this._buttons.push(dimensionsButton, shaderButton, vertexButton);

    /*
    const colorDropdown = new ButtonBuilder()
      .setButtonType(Dropdown)
      .setButtonName("Color")
      .setButtonDisplayName("Color")
      .setQuestions({
        red: Color.Red,
        blue: Color.Blue,
        green: Color.Green
      })
      .setOnClick(function (this: Dropdown, selected?: string) {
        console.log("Selected color:", selected ?? this.getValue());
      })
      .build();

    const shaderDropdown = new ButtonBuilder()
      .setButtonType(Dropdown)
      .setButtonName("ShaderType")
      .setButtonDisplayName("Shader Type")
      .setQuestions({
        flat: ShaderType.Flat,
        smooth: ShaderType.Smooth
      })
      .setOnClick(function (this: Dropdown, selected?: string) {
        console.log("Shader type:", selected ?? this.getValue());
      })
      .build();

    const vertexDropdown = new ButtonBuilder()
      .setButtonType(Dropdown)
      .setButtonName("VertexFormat")
      .setButtonDisplayName("Vertex Format")
      .setQuestions({
        list: VertexFormat.List,
        strip: VertexFormat.Strip,
        index: VertexFormat.Index
      })
      .setOnClick(function (this: Dropdown, selected?: string) {
        console.log("Vertex format:", selected ?? this.getValue());
      })
      .build();

      // remove simple button
    const simpleBtn = new ButtonBuilder()
      .setButtonType(SimpleButton)
      .setButtonName("Apply")
      .setButtonDisplayName("Apply")
      .setOnClick(function (this: SimpleButton, value?: string) {
        console.log("Simple button clicked:", value ?? this._name);
      })
      .build();

      */

    /*

    
      // Create toolbars
    const toolbar1 = new Toolbar('basicInputs', [myButton1, myButton2]);
    toolbar1.getElement().classList.add('toolbar-horizontal');

    const toolbar2 = new Toolbar('fileToolsDropdown', [myButton3, myButton4, myButton5]);
    toolbar2.getElement().classList.add('toolbar-vertical');
    */

    // small toolbar
    const smallToolbar = new Toolbar(" Toolbar 1", [
      shaderButton,
      clientForm,
      dimensionsButton,
    ]);

    const smallToolbar1 = new Toolbar(" Toolbar 2", [
      dimensionsButton,
      vertexButton,
      physicalParams,
    ]);

    // Create workbench
    this._workbench = new Workbench("mainWorkbench", [
      smallToolbar,
      smallToolbar1,
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
