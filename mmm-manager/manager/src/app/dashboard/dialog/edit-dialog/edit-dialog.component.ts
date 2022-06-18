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
   }

  ngOnInit(): void {
  }

  onSaveClicked(){
    this.configItems['header'] = this.configForm.controls['header'].value[0];
    this.setModuleConfigFromForm(this.configItems, this.configItemForms, false);
    this.dialogRef.close(this.configItems);
  }

  get configItemForms() {
    return this.configForm.controls["configItemForms"] as FormArray;
  }

  get subArray(){
    return this.configForm.controls["subArray"] as FormArray;
  }

  createConfigItemForms(configItems: ModuleConfig, isNested: boolean) {
    Object.keys(configItems).forEach((itemKey =>{
      if(Array.isArray(configItems[itemKey as keyof ModuleConfig])){
        const array = configItems[itemKey as keyof ModuleConfig] as Array<ModuleConfig>;
        this.keys.push(itemKey);
        let subArray = this.fb.array([]);
        console.log(subArray);
          array.forEach((element, indx) =>{
            Object.keys(element).forEach((subKey) =>{
              subArray.push(this.createItemInForm(element, subKey));
              this.subKeys.push(subKey);
              this.tags.push(indx);
            });
          });
        this.configItemForms.push(subArray);
      } else if (typeof configItems[itemKey as keyof ModuleConfig] === 'object') {
        Object.keys(configItems[itemKey as keyof ModuleConfig]).forEach(subObjectKey =>{
          const formInGroup =  this.createItemInForm(configItems[itemKey as keyof ModuleConfig] as ModuleConfig, subObjectKey);
          console.log(formInGroup);
          this.keys.push("#" + itemKey + ": " +subObjectKey);
          this.configItemForms.controls.push(formInGroup);
        });
      }else{
        this.keys.push(itemKey);
        this.configItemForms.push(this.createItemInForm(configItems, itemKey));
      }
    }));
  }

  createItemInForm(configItems: ModuleConfig, itemKey: string): AbstractControl{
    return new FormControl([configItems[itemKey as keyof ModuleConfig]]);
  }

  setModuleConfigFromForm(configItem: ModuleConfig, configForms: AbstractControl, isNested: boolean){
    const arrayControls = (configForms as FormArray).controls;
    if (arrayControls && arrayControls.length > 1) {
      arrayControls.forEach((control, indx) =>{
        Object.keys(configItem).forEach((item, itemIndex) =>{
          const isSubArray = control instanceof FormArray;
          const isSubForm = control instanceof FormControl;
          if (isSubForm) {
            const subForm = control as FormControl;
            var key = isNested ? this.subKeys[indx] :  this.keys[indx];
            if (key.indexOf("#") > -1){
              key = key.slice(key.indexOf(':'), key.length);
            }
            if(item === key){
              configItem[item] = subForm.value;
            }
          }
          if(isSubArray) {
            this.setModuleConfigFromForm(configItem as ModuleConfig, control, true);
          }
        });
      });
    }
    else {
      Object.keys(configItem).forEach((item, itemIndex) =>{
        if(item === this.keys[itemIndex]){
          configItem[item] = arrayControls[0].value[0];
        }
      });
    }
  }
}
