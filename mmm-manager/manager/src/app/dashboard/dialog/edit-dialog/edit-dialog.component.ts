import { Component, OnInit, Inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModuleConfig } from 'src/app/models/ModuleConfig';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css'],
})
export class EditDialogComponent implements OnInit {
  configItems: ModuleConfig = {};
  configForm: FormGroup;
  subKeys: string[] = [];
  tags: number[] = [];
  title: string;
  keys: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { config: ModuleConfig; title: string },
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditDialogComponent>
  ) {
    this.configItems = data.config;
    this.title = data.title;
    this.configForm = this.fb.group({});
    this.createFormFromConfigItem(
      this.configItems,
      this.configForm,
      this.keys,
      null
    );
    console.log(this.configForm);
    console.log(this.keys);
  }

  ngOnInit(): void {}

  onSaveClicked() {
    this.setModuleConfigFromForm(this.configItems, this.configForm, this.keys);
    this.dialogRef.close(this.configItems);
  }

  getNodeKey(node: any) {
    return node.fullKey;
  }

  createFormFromConfigItem(
    configItem: ModuleConfig,
    parentControl: AbstractControl,
    keys: any[],
    parent: any
  ): AbstractControl | undefined {
    console.log(configItem);
    let result = undefined;
    for (let indx = 0; indx < Object.keys(configItem).length; indx++) {
      const itemKey = Object.keys(configItem)[indx];
      const item = configItem[itemKey] as ModuleConfig;
      if (Array.isArray(item)) {
        const array = this.fb.array([]);
        keys.push({
          key: itemKey,
          children: [],
          fullKey: parent ? parent.fullKey + '.' + itemKey : itemKey,
          parent: parent ? parent.fullKey : '',
        });
        result = this.createFormFromConfigItem(
          item,
          array,
          keys[keys.length - 1].children,
          keys[keys.length - 1]
        );
        if (parentControl instanceof FormGroup) {
          (parentControl as FormGroup).addControl(itemKey, array);
        } else {
          (parentControl as FormArray).controls.push(array);
        }
      } else if (typeof item === 'object') {
        const group = this.fb.group({});
        keys.push({
          key: itemKey,
          children: [],
          fullKey: parent ? parent.fullKey + '.' + itemKey : itemKey,
          parent: parent ? parent.fullKey : '',
        });
        result = this.createFormFromConfigItem(
          item,
          group,
          keys[keys.length - 1].children,
          keys[keys.length - 1]
        );

        if (parentControl instanceof FormGroup) {
          (parentControl as FormGroup).addControl(itemKey, group);
        } else {
          (parentControl as FormArray).controls.push(group);
        }
      } else {
        const isBoolean = typeof item === 'boolean';
        const isString = typeof item === 'string';
        const type = isBoolean ? 'bool' : isString ? 'str' : 'num';
        keys.push({
          key: itemKey,
          children: [],
          fullKey: parent ? parent.fullKey + '.' + itemKey : itemKey,
          parent: parent ? parent.fullKey : '',
          type: type,
        });
        result = this.createItemInForm(item, itemKey);

        if (parentControl instanceof FormGroup) {
          (parentControl as FormGroup).addControl(itemKey, result);
        } else {
          (parentControl as FormArray).controls.push(result);
        }
      }
    }
    return result;
  }

  createItemInForm(configItem: ModuleConfig, itemKey: string): AbstractControl {
    let contr = new FormControl([configItem[itemKey as keyof ModuleConfig]]);
    contr.patchValue(configItem);
    return contr;
  }

  setModuleConfigFromForm(
    configItem: ModuleConfig,
    configForms: AbstractControl,
    keys: string[],
    isNested: boolean = false
  ) {
    let isFormControl = configForms instanceof FormControl;
    let isFormArray = configForms instanceof FormArray;
    if (isFormArray) {
      const arrayControls = (configForms as FormArray).controls;
      for (let indx = 0; indx < arrayControls.length; indx++) {
        const configKeys = Object.keys(configItem);
        for (let i = 0; i < configKeys.length; i++) {
          const isSubArray = arrayControls[indx] instanceof FormArray;
          const isSubForm = arrayControls[indx] instanceof FormControl;
          if (isSubForm) {
            const subForm = arrayControls[indx] as FormControl;
            var key = keys[indx];
            if (typeof configItem[configKeys[i]] === 'object') {
              if (key.indexOf('#') > -1) {
                key = key.slice(key.indexOf('#') + 1, key.indexOf(':'));
                if (configKeys[i] === key) {
                  this.setModuleConfigFromForm(
                    configItem[configKeys[i]] as ModuleConfig,
                    subForm,
                    keys
                  );
                }
              }
            } else if (configKeys[i] === key) {
              configItem[configKeys[i]] = subForm.value;
              break;
            }
            if (isNested) {
              const subConfigKeys = Object.keys(configItem);
              for (let j = 0; j < subConfigKeys.length; j++) {
                if (typeof configItem[subConfigKeys[j]] === 'object') {
                  let subItem = configItem[subConfigKeys[j]] as ModuleConfig;
                  const subItemKeys = Object.keys(subItem);
                  for (let k = 0; k < subItemKeys.length; k++) {
                    if ((subItemKeys[k] = keys[indx])) {
                      this.setModuleConfigFromForm(
                        subItem[k] as ModuleConfig,
                        subForm,
                        keys
                      );
                    }
                  }
                }
              }
            }
          }
          if (isSubArray) {
            const subArray = arrayControls[indx] as FormControl;
            this.setModuleConfigFromForm(
              configItem[configKeys[indx]] as ModuleConfig,
              subArray,
              this.subKeys,
              true
            );
          }
        }
      }
    } else if (isFormControl) {
      const control = configForms as FormControl;
      configItem = control.value;
    }
  }
}
