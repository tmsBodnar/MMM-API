import { Component, OnInit, Inject} from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
  tags: string[] = [];
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Module,
    private fb: FormBuilder) {
    this.module = data;
    if (this.module.config !== undefined) {
      this.processNestedConfig(this.module.config, false);
    }
    this.configForm = this.fb.group({
      header: new FormControl([this.module.header]),
      configItemForms: this.fb.array([])
    });
    this.createConfigItemForms(this.configItems, -1);
    console.log(this.tags, this.keys);
   }

  ngOnInit(): void {
  }

  get configItemForms() {
    return this.configForm.controls["configItemForms"] as FormArray;
  }

  createConfigItemForms(configItems: ModuleConfig, index: number) {
    Object.keys(configItems).forEach(((itemKey, itemIndex) =>{
      if(Array.isArray(configItems[itemKey as keyof ModuleConfig])){
        const array = configItems[itemKey as keyof ModuleConfig] as Array<any>;
          array.forEach((element, elementIndex) =>{
            this.createConfigItemForms(element, elementIndex);
          });
      }else{
        this.keys.push(itemKey);
        if (index > -1) {
          this.tags.push(index + '');
        }
       const configItemForm = new FormControl([configItems[itemKey as keyof ModuleConfig]]);
       this.configItemForms.push(configItemForm);
      }
    }));
    console.log(this.configItemForms);
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
}
