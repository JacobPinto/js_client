import { 
  TextEntryWithButton, 
  Checkbox, 
  RadioButton, 
  FileEntry, 
  Dropdown,
  SimpleButton 
} from './button.js';
import { FormElementParam, ButtonType } from './buttonParams.js';

export class ButtonBuilder {
  private params: FormElementParam;
  

  constructor() {
    this.params = new FormElementParam();
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
        return new TextEntryWithButton(this.params);
      case Checkbox:
        return new Checkbox(this.params);
      case RadioButton:
        return new RadioButton(this.params);
      case FileEntry:
        return new FileEntry(this.params);
      case Dropdown:
        return new Dropdown(this.params);
      case SimpleButton:
        return new SimpleButton(this.params);
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
