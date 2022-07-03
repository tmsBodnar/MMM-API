import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgControlStatus } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ModuleConfig } from 'src/app/models/ModuleConfig';
import { Module } from '../../../models/Module';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  configItems: ModuleConfig = {};
  configForm : FormGroup;
  keys: string[] = [];
  subKeys : string[] = [];
  tags: number[] = [];
  title: string;
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {config: ModuleConfig, title: string},
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditDialogComponent>) {
    this.configItems = data.config;
    this.title = data.title;
    this.configForm = this.fb.group({});
    this.createFormFromConfigItem(this.configItems, this.configForm);
    console.log(this.configForm);
   }

  ngOnInit(): void {
  }

  onSaveClicked(){
    this.setModuleConfigFromForm(this.configItems, this.configForm, this.keys);
    this.dialogRef.close(this.configItems);
  }

  get subArray(){
    return this.configForm.controls["subArray"] as FormArray;
  }

  createFormFromConfigItem(configItem: ModuleConfig, parentControl: AbstractControl): AbstractControl | undefined {
    console.log(configItem);
    let result = undefined;
    for (let indx = 0; indx < Object.keys(configItem).length; indx++){
        const itemKey = Object.keys(configItem)[indx];
        const item = configItem[itemKey] as ModuleConfig;
        if (Array.isArray(item)){
          console.log("array:", itemKey, item);
          const array = this.fb.array([]);
          result = this.createFormFromConfigItem(item, array);
          if (parentControl instanceof FormGroup) {
            (parentControl as FormGroup).addControl(itemKey, array);
          }  else {
              (parentControl as FormArray).controls.push(array);
          }
        } else if (typeof item === "object"){
          console.log("object:", itemKey, item);
          const group = this.fb.group({});
          result = this.createFormFromConfigItem(item, group);
          if (parentControl instanceof FormGroup) {
            (parentControl as FormGroup).addControl(itemKey, group);
          }  else {
              (parentControl as FormArray).controls.push(group);
          }
        } else {
          console.log("other:", itemKey, item);
          result = this.createItemInForm(item, itemKey);
          if (parentControl instanceof FormGroup) {
            (parentControl as FormGroup).addControl(itemKey, result);
          }  else {
              (parentControl as FormArray).controls.push(result);
          }
        }
    }
    return result;
  }

  createItemInForm(configItem: ModuleConfig, itemKey: string): AbstractControl{
    let contr = new FormControl([configItem[itemKey as keyof ModuleConfig]]);
    contr.patchValue(configItem);
    return contr;
  }

  setModuleConfigFromForm(configItem: ModuleConfig, configForms: AbstractControl, keys: string[], isNested: boolean = false){
    let isFormControl = configForms instanceof FormControl;
    let isFormArray = configForms instanceof FormArray;
    if (isFormArray){
      const arrayControls = (configForms as FormArray).controls;
        for (let indx = 0; indx < arrayControls.length; indx++){
          const configKeys = Object.keys(configItem);
          for (let i = 0; i <configKeys.length; i++){
            const isSubArray = arrayControls[indx] instanceof FormArray;
            const isSubForm = arrayControls[indx] instanceof FormControl;
            if (isSubForm) {
              const subForm = arrayControls[indx] as FormControl;
              var key = keys[indx];
              if (typeof configItem[configKeys[i]] === 'object'){
                if (key.indexOf("#") > -1){
                  key = key.slice(key.indexOf('#') + 1,key.indexOf(':'));
                  if (configKeys[i] === key) {
                    this.setModuleConfigFromForm(configItem[configKeys[i]] as ModuleConfig, subForm, keys);  
                  }
                }
              }
              else if(configKeys[i] === key){
                configItem[configKeys[i]] = subForm.value;
                break;
              }
              if (isNested){
                const subConfigKeys = Object.keys(configItem);
                for (let j = 0; j < subConfigKeys.length; j++){
                  if (typeof configItem[subConfigKeys[j]] === 'object'){
                    let subItem = configItem[subConfigKeys[j]] as ModuleConfig;
                    const subItemKeys = Object.keys(subItem);
                    for (let k = 0; k < subItemKeys.length; k++  ) {
                      if (subItemKeys[k] = keys[indx]){
                        this.setModuleConfigFromForm(subItem[k] as ModuleConfig, subForm, keys);
                  }
                    }
                    
                  }
                }
                
              }
            }
            if(isSubArray) {
              const subArray = arrayControls[indx] as FormControl;
              this.setModuleConfigFromForm(configItem[configKeys[indx]] as ModuleConfig, subArray, this.subKeys, true);
            }
          }
        }
    }
    else if (isFormControl) {
      const control = (configForms as FormControl);
        configItem = control.value;
    }
  }
}
