import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ModuleConfig } from 'src/app/models/ModuleConfig';

@Injectable({
  providedIn: 'root',
})
export class FormCreatorService {
  constructor(private fb: FormBuilder) {}

  createFormFromConfigItem(
    configItem: ModuleConfig,
    parentControl: AbstractControl,
    keys: any[],
    parent: any
  ): AbstractControl | undefined {
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
          plus: true,
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
          plus: itemKey === 'config' ? true : false,
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
          plus: false,
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
    configForm: AbstractControl
  ) {
    for (let indx = 0; indx < Object.keys(configItem).length; indx++) {
      const itemKey = Object.keys(configItem)[indx];
      const item = configItem[itemKey] as ModuleConfig;
      if (Array.isArray(item)) {
        const form = configForm as FormGroup;
        this.setModuleConfigFromForm(item, form.controls[itemKey]);
      } else if (typeof item === 'object') {
        const form = configForm as FormGroup;
        this.setModuleConfigFromForm(item, form.controls[itemKey]);
      } else {
        const form = configForm as FormGroup;
        const key = itemKey;
        configItem[itemKey] = form.controls[itemKey]?.value;
      }
    }
  }
}
