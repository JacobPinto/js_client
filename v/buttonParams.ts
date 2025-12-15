import { 
  TextEntryWithButton, 
  Checkbox, 
  RadioButton, 
  FileEntry, 
  Dropdown, 
  SimpleButton
} from './button.js';


// All valid button classes
export type ButtonType =

  | typeof TextEntryWithButton

  | typeof Checkbox

  | typeof RadioButton

  | typeof FileEntry

  | typeof Dropdown

  | typeof SimpleButton;



export class FormElementParam {

  public type?: ButtonType;
  public name: string = '';
  public displayName: string = '';
  public questions: Record<string, string> = {};
  public contextObj?: Record<string, string>;
  public onClick?: Function;

  constructor(init?: Partial<FormElementParam>) {
    
    Object.assign(this, init);

  }


}
