import { Component, OnInit, Inject} from '@angular/core';
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
  configInput: ModuleConfig = {};


  constructor(@Inject(MAT_DIALOG_DATA) public data: Module) {
    this.module = data;
    if (this.module.config !== undefined) {
      this.processNestedConfig(this.module.config, false);
    }
    console.log(this.configInput);
   }

  ngOnInit(): void {
  }
processNestedConfig(conf: ModuleConfig, isNested: boolean){
      Object.keys(conf).forEach((key) => {
        if(Array.isArray(conf[key as keyof ModuleConfig])){
          const array = conf[key as keyof ModuleConfig] as Array<any>;
          array.forEach(element =>{
            this.processNestedConfig(element, true);
            this.configInput[key]=conf[key as keyof ModuleConfig];
          });
        } else if (typeof conf[key as keyof ModuleConfig] === 'object') {
            this.processNestedConfig(conf[key as keyof ModuleConfig] as ModuleConfig, true);
            this.configInput[key]=conf[key as keyof ModuleConfig];
        }
        if(!isNested)
        {
            this.configInput[key]=conf[key as keyof ModuleConfig];
        }
      });
  }
}
