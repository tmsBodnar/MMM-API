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
  }

  ngOnInit(): void {}

  onSubmit() {
    this.setModuleConfigFromForm(this.configItems, this.configForm);
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
