import {
  TextEntryWithButton,
  Checkbox,
  RadioButton,
  FileEntry,
  Dropdown
} from './button.js';

import { VisibilityState } from './visibilityState.js';

export type ButtonType =
  | TextEntryWithButton
  | Checkbox
  | RadioButton
  | FileEntry
  | Dropdown;

export class ButtonBuilder {
  private buttons: ButtonType[] = [];
  private buttonGroups: Map<string, ButtonType[]> = new Map();

  /**
   * Adds a button to the builder.
   */
  addButton(button: ButtonType): this {
    this.buttons.push(button);
    return this;
  }

  

  /**
   * Renders all buttons managed by the builder.
   * returns A container element with all rendered buttons
   */
  
  build(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'button-builder';

    this.buttons.forEach(btn => {
      const form = btn.render();
      container.appendChild(form);
    });

    return container;
  }

  
  
  
  
}
