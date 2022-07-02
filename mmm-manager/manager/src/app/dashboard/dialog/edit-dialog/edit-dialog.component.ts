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
    this.createConfigItemForms(this.configItems, this.configForm);
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

  createConfigItemForms(configItems: ModuleConfig, parentControl: AbstractControl): AbstractControl | undefined{
      console.log(configItems);
      let result = undefined;
      for (let indx = 0; indx < Object.keys(configItems).length; indx++){
        const itemKey = Object.keys(configItems)[indx];
        const configItem = configItems[itemKey] as ModuleConfig;
        if (Array.isArray(configItem)){
          let subArray = this.fb.array([]);
          for (let subIndex = 0; subIndex < Object.keys(configItem).length; subIndex++){
            let subItem = configItem[subIndex];
            let subControl = this.createConfigItemForms(subItem, subArray) as AbstractControl;
            subArray.push(subControl);
          };
          if (parentControl instanceof FormGroup) {
            (parentControl as FormGroup).addControl(itemKey, subArray);
          }  else {
              (parentControl as FormArray).controls.push(subArray);
          }
          result = subArray;
        }else if ( typeof configItem === "object") {
          let subGroup = this.fb.group({});
          for (let subIndex = 0; subIndex < Object.keys(configItem).length; subIndex++){
            let subKey = Object.keys(configItem)[subIndex];
            let subItem = configItem[subKey];
            const type = typeof subItem;
            if (type !== "object"){ 
              let subControl = this.createItemInForm(subItem as ModuleConfig, subKey) as AbstractControl;  
              subGroup.addControl(subKey, subControl);
            } else {
              let subControl = this.createConfigItemForms(subItem as ModuleConfig, subGroup) as AbstractControl;
              subGroup.addControl(subKey, subControl);
            }
          }
            if (parentControl instanceof FormGroup) {
              (parentControl as FormGroup).addControl(itemKey, subGroup);
           } else if (parentControl instanceof FormArray) {
              (parentControl as FormArray).controls.push(subGroup);
           }
           else {
            console.log("nope 1");
           }
           result = subGroup;
        } else {
           if (parentControl instanceof FormGroup) {
              const parentGroup = parentControl as FormGroup;              
              const control = this.createItemInForm(configItem, itemKey);
              parentGroup.addControl(itemKey, control);
              result = control;
            } 
            else if (parentControl instanceof FormArray){
              const control = this.createItemInForm(configItem, itemKey);
              const parentArray = parentControl as FormArray;
                if (parentArray.controls.length === 0 || parentArray.controls[parentArray.controls.length - 1].parent){
                  (parentControl as FormArray).controls.push(control);
                }
                result = control;
            } else {
              console.log("nope 2");
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
