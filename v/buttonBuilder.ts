import { 
  TextEntryWithButton, 
  TextEntryWithDropdownAndButton,
  Checkbox, 
  RadioButton, 
  FileEntry, 
  Dropdown,
  SimpleButton 
} from './button.js';
import { FormElementParam, ButtonType } from './buttonParams.js';
import { ControllerSimEngine } from '../c/controllerSimEngine.js';

export class ButtonBuilder {
  private _params: FormElementParam;
  private _controller: ControllerSimEngine;
  
  constructor(controller: ControllerSimEngine) {
    this._params = new FormElementParam();
    this._controller = controller;
  }

  setButtonType(type: ButtonType) {
    this._params.type = type;
    return this;
  }

  setButtonName(name: string) {
    this._params.name = name;
    return this;
  }

  setButtonDisplayName(displayName: string) {
    this._params.displayName = displayName;
    return this;
  }

  setSubmitLabel(label: string) {
    this._params.submitLabel = label;
    return this;
  }

  setQuestions(questions: { [key: string]: string }) {
    this._params.questions = questions;
    return this;
  }

  setContextObj(context: { [key: string]: any }) {
    this._params.contextObj = context;
    return this;
  }

  setOnClick(handler: Function) {
    this._params.onClick = handler;
    return this;
  }

  setUpdate(handler: Function) {
    this._params.update = handler;
    return this;
  }

  private _factory(type: ButtonType) {
    switch (type) {
      case TextEntryWithButton:
        return new TextEntryWithButton(this._params, this._controller);
      case TextEntryWithDropdownAndButton:
        return new TextEntryWithDropdownAndButton(this._params, this._controller);
      case Checkbox:
        return new Checkbox(this._params, this._controller);
      case RadioButton:
        return new RadioButton(this._params, this._controller);
      case FileEntry:
        return new FileEntry(this._params,  this._controller);
      case Dropdown:
        return new Dropdown(this._params,  this._controller);
      case SimpleButton:
        return new SimpleButton(this._params,  this._controller);
      default:
        throw new Error('Unknown button type');
    }
  }

  build() {
    if (!this._params.type) {
      throw new Error('Button type is not set!');
    }
    return this._factory(this._params.type);
  }
}
