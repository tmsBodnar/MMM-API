import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModuleConfig } from 'src/app/models/ModuleConfig';
import { Module } from '../../../models/Module';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  module: Module;
  config: ModuleConfig;
  configItems: ModuleConfig = {};
  configForm : FormGroup;
  keys: string[] = [];
  subKeys : string[] = [];
  tags: number[] = [];
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Module,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditDialogComponent>) {
    this.module = data;
    if (this.module.config !== undefined) {
      this.processNestedConfig(this.module.config, false);
    }
    this.configForm = this.fb.group({
      header: new FormControl([this.module.header]),
      configItemForms: this.fb.array([])
    });
    
    this.createConfigItemForms(this.configItems,false);
    console.log(this.configItemForms);
    console.log(this.subKeys);
    console.log(this.keys);
    console.log(this.tags);
   }

  ngOnInit(): void {
  }

  onSaveClicked(){
    this.setModuleConfigToModule();
    this.dialogRef.close(this.module);
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

  processNestedConfig(conf: ModuleConfig, isNested: boolean){
      Object.keys(conf).forEach((key) => {
        if(Array.isArray(conf[key as keyof ModuleConfig])){
          const array = conf[key as keyof ModuleConfig] as Array<any>;
          array.forEach(element =>{
            this.processNestedConfig(element, true);
            this.configItems[key]=conf[key as keyof ModuleConfig];
          });
        } else if (typeof conf[key as keyof ModuleConfig] === 'object') {
            this.processNestedConfig(conf[key as keyof ModuleConfig] as ModuleConfig, true);
            this.configItems[key]=conf[key as keyof ModuleConfig];
        }
        if(!isNested)
        {
            this.configItems[key]=conf[key as keyof ModuleConfig];
        }
      });
  }
  setModuleConfigToModule(){
    this.module.header = this.configForm.controls['header'].value[0];
    this.configItemForms.controls.forEach((control, indx) => {
      Object.keys(this.module.config).forEach(element => {
        if (Array.isArray(this.module.config['element'])){
          const arr = this.module.config['element'] as Array<any>;
          arr.forEach(item => {
            console.log(item, this.keys[indx]);
            if (item === this.keys[indx]){
              item.value = control.value[0];
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
          console.log(element, this.keys[indx]);
          if(element === this.keys[indx]){
            this.module.config[element] = control.value[0];
          }
        }
      });
    });
  }
}
