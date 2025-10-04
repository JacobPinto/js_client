import { 
  TextEntryWithButton, 
  Checkbox, 
  RadioButton, 
  FileEntry, 
  Dropdown,
  SimpleButton 
} from './button.js';
import { FormElementParam, ButtonType } from './buttonParams.js';
import { ControllerSimEngine } from '../c/controllerSimEngine.js';

export class ButtonBuilder {
  private params: FormElementParam;
  private _controller: ControllerSimEngine;
  

  constructor(controller: ControllerSimEngine) {
    this.params = new FormElementParam();
    this._controller = controller;
  }

  setButtonType(type: ButtonType) {
    this.params.type = type;
    return this;
  }

  setButtonName(name: string) {
    this.params.name = name;
    return this;
  }

  setButtonDisplayName(displayName: string) {
    this.params.displayName = displayName;
    return this;
  }

  setQuestions(questions: { [key: string]: string }) {
    this.params.questions = questions;
    return this;
  }

  setContextObj(context: { [key: string]: any }) {
    this.params.contextObj = context;
    return this;
  }

  setOnClick(handler: Function) {
    this.params.onClick = handler;
    return this;
  }

  protected _factory(type: ButtonType) {
    switch (type) {
      case TextEntryWithButton:
        return new TextEntryWithButton(this.params, this._controller);
      case Checkbox:
        return new Checkbox(this.params, this._controller);
      case RadioButton:
        return new RadioButton(this.params, this._controller);
      case FileEntry:
        return new FileEntry(this.params,  this._controller);
      case Dropdown:
        return new Dropdown(this.params,  this._controller);
      case SimpleButton:
        return new SimpleButton(this.params,  this._controller);
      default:
        throw new Error('Unknown button type');
    }
  }

  build() {
    if (!this.params.type) {
      throw new Error('Button type is not set!');
    }
    return this._factory(this.params.type);
  }
}
