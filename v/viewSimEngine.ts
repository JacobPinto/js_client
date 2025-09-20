import { TextEntryWithButton, Checkbox, RadioButton, FileEntry, Dropdown } from './button.js';
import { ButtonBuilder } from './buttonBuilder.js';
import { Toolbar } from './toolbar.js';
import { Workbench } from './workbench.js';
import { VisibilityState } from './visibilityState.js';

export class ViewSimEngine {
  private workbench: Workbench;

  constructor() {
    // Use builder for all buttons
    const myButton1 = new ButtonBuilder()
      .setButtonType(TextEntryWithButton)
      .setButtonName('FluidProperties')
      .setButtonDisplayName('Fluid Properties')
      .setQuestions({ density: 'Density', viscosity: 'Viscosity' })
      .setOnClick(function(this: TextEntryWithButton) {
        const d = this._form.querySelector('input[name="density"]') as HTMLInputElement;
        const v = this._form.querySelector('input[name="viscosity"]') as HTMLInputElement;
        console.log('Density', d.value);
        console.log('Viscosity', v.value);
      })
      .build();

    const myButton2 = new ButtonBuilder()
      .setButtonType(Checkbox)
      .setButtonName('Dimensionality')
      .setButtonDisplayName('Dimensionality')
      .setQuestions({ $2d: '2D', $3d: '3D' })
      .setOnClick(function(this: Checkbox) {
        this._form.querySelectorAll('input').forEach(input => {
          if (input.type === 'checkbox') console.log(input.name, input.checked);
        });
      })
      .build();

    const myButton3 = new ButtonBuilder()
      .setButtonType(RadioButton)
      .setButtonName('Dimensionality')
      .setButtonDisplayName('Dimensionality')
      .setQuestions({ d2: '2D', d3: '3D' })
      .setOnClick(function(this: RadioButton) {
        this._form.querySelectorAll('input').forEach(input => {
          if (input.type === 'radio') console.log(input.name, input.checked);
        });
      })
      .build();

    const myButton4 = new ButtonBuilder()
      .setButtonType(FileEntry)
      .setButtonName('Geometry')
      .setButtonDisplayName('Geometry')
      .setQuestions({ geometry: 'Target geometry' })
      .setOnClick(function(this: FileEntry) {
        console.log('File input triggered');
      })
      .build();

    const myButton5 = new ButtonBuilder()
      .setButtonType(Dropdown)
      .setButtonName('Course')
      .setButtonDisplayName('Course')
      .setQuestions({ MCA: 'Master of Applications', BCA: 'Bachelor of Applications', BSC: 'Bachelor of Science' })
      .setOnClick(function(this: Dropdown, selected?: string) {
        console.log('Selected option:', selected ?? this.getValue());
      })
      .build();

    // Create toolbars
    const toolbar1 = new Toolbar('basicInputs', [myButton1, myButton2]);
    toolbar1.getElement().classList.add('toolbar-horizontal');

    const toolbar2 = new Toolbar('fileToolsDropdown', [myButton3, myButton4, myButton5]);
    toolbar2.getElement().classList.add('toolbar-vertical');

    // Create workbench
    this.workbench = new Workbench('mainWorkbench', [toolbar1, toolbar2]);
  }

  render(): void {
    document.body.appendChild(this.workbench.getElement());
  }

  toggleWorkbench(state: VisibilityState): void {
    this.workbench.setVisibility(state);
  }

  toggleToolbar(name: string, state: VisibilityState): void {
    this.workbench.setToolbarVisibility(name, state);
  }
}
