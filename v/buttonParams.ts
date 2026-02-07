import { 
  TextEntryWithButton, 
  TextEntryWithDropdownAndButton,
  Checkbox, 
  RadioButton, 
  FileEntry, 
  Dropdown, 
  SimpleButton
} from './button.js';


// All valid button classes
export type ButtonType =
  | typeof TextEntryWithButton
  | typeof TextEntryWithDropdownAndButton
  | typeof Checkbox
  | typeof RadioButton
  | typeof FileEntry
  | typeof Dropdown
  | typeof SimpleButton;


export class FormElementParam {

  public type?: ButtonType;
  public name: string = '';
  public displayName: string = '';
  public submitLabel?: string = '';
  public questions: Record<string, string> = {};
  public contextObj?: Record<string, string>;
  public onClick?: Function;
  public update?: Function;

  constructor(init?: Partial<FormElementParam>) {
    
    Object.assign(this, init);

  }


}
