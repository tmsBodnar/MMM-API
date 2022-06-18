import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgControlStatus } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    this.configForm = this.fb.group({
      header: new FormControl([this.configItems['header']]),
      configItemForms: this.fb.array([])
    });
    
    this.createConfigItemForms(this.configItems,false);
    console.log(this.configItemForms);
    console.log(this.configItems);
    console.log(this.subKeys);
    console.log(this.keys);
    console.log(this.tags);
   }

  ngOnInit(): void {
  }

  onSaveClicked(){
    this.configItems['header'] = this.configForm.controls['header'].value[0];
  //  this.setModuleConfigToModule();
    this.setModuleConfigFromForm(this.configItems, this.configItemForms);
    console.log(this.configItems);
    this.dialogRef.close(this.configItems);
  }


  get configItemForms() {
    return this.configForm.controls["configItemForms"] as FormArray;
  }
  get subArray(){
    return this.configForm.controls["subArray"] as FormArray;
  }

  createConfigItemForms(configItems: ModuleConfig, isNested: boolean, parent?: string) {
    Object.keys(configItems).forEach(((itemKey, itemIndex) =>{
      if(Array.isArray(configItems[itemKey as keyof ModuleConfig])){
        const array = configItems[itemKey as keyof ModuleConfig] as Array<ModuleConfig>;
        this.keys.push(itemKey);
        let subArray = this.fb.array([]);
          array.forEach((element, indx) =>{
            Object.keys(element).forEach((subKey) =>{
              subArray.push(this.createItemInForm(element, subKey));
              this.subKeys.push(subKey);
              this.tags.push(indx);
            });
          });
        this.configItemForms.push(subArray);
      } else if (typeof configItems[itemKey as keyof ModuleConfig] === 'object') {
        this.createConfigItemForms(configItems[itemKey as keyof ModuleConfig] as ModuleConfig, true, itemKey);
      }else{
        if (isNested) {
          this.keys.push("#" + parent + ": " + itemKey);
        } else {
          this.keys.push(itemKey);
        }
        this.configItemForms.push(this.createItemInForm(configItems, itemKey));
      }
    }));
  }

  createItemInForm(configItems: ModuleConfig, itemKey: string): AbstractControl{
    return new FormControl([configItems[itemKey as keyof ModuleConfig]]);

  }

  setModuleConfigFromForm(configItem: ModuleConfig, configForms: AbstractControl){
    
    const arrayControls = (configForms as FormArray).controls;
    const groupControl = (configForms as FormControl);
    if (arrayControls && arrayControls.length > 1) {
      arrayControls.forEach((control, indx) =>{
        Object.keys(configItem).forEach((item, itemIndex) =>{
          const subArray = control as FormArray;
          const subGroup = control as FormGroup;
          const subForm = control as FormControl;
          if (subForm) {
            console.log("form", configItem[item]);
            if(item === this.keys[indx]){
              configItem[item] = subForm.value;
            }
          }
          if(subArray) {
            this.setModuleConfigFromForm(configItem[item] as ModuleConfig, control);
          }
        });
      });
    }
    else {
      Object.keys(configItem).forEach((item, itemIndex) =>{
        if(item === this.keys[itemIndex]){
          configItem[item] = groupControl.value[0];
        }
      });
    }
  }
  
  setModuleConfigToModule(){
    this.configItemForms.controls.forEach((control, indx) => {
      Object.keys(this.configItems).forEach(element => {
        if (Array.isArray(this.configItems[element])){
          const arr = this.configItems[element] as Array<any>;
          arr.forEach(item => {
            const formArray = (control as FormArray).controls;
              if (formArray) {
                  this.subKeys.forEach ((subKey, subIndx) => {
                    console.log(item, subKey, formArray[subIndx]);
                    if( item[subIndx] === subKey) {
                      item = formArray[subIndx].value;
                    }
                  });
              }  
          });
        // }
        // if (typeof (this.module.config['element'] === 'object')){
        //   Object.keys(this.module.config['element']).forEach(item =>{
        //     console.log(item, this.keys[indx]);
        //     if(item === this.keys[indx]){
        //       this.module.config[item] = control.value[0];
        //     }
        //   });
        } else{
   //       console.log(element, this.keys[indx]);
          if(element === this.keys[indx]){
            this.configItems[element] = control.value[0];
          }
        }
      });
    });
  }
}
