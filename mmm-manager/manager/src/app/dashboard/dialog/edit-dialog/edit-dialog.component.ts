import { Component, OnInit, Inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ModuleConfig } from 'src/app/models/ModuleConfig';
import { FormCreatorService } from 'src/app/services/form/form-creator.service';

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
  isAddNewItem = false;
  selectedArrayItem: ModuleConfig = {};
  selectedKey: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { config: ModuleConfig; title: string },
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    private formService: FormCreatorService
  ) {
    dialogRef.disableClose = true;
    this.configItems = data.config;
    this.title = data.title;
    this.configForm = this.fb.group({});
    this.formService.createFormFromConfigItem(
      this.configItems,
      this.configForm,
      this.keys,
      null
    );
  }

  ngOnInit(): void {}

  onSubmit() {
    if (!this.isAddNewItem) {
      this.formService.setModuleConfigFromForm(
        this.configItems,
        this.configForm
      );
      this.dialogRef.close(this.configItems);
    } else {
      this.formService.setModuleConfigFromForm(
        this.selectedArrayItem,
        this.configForm
      );
      (this.configItems[this.selectedKey] as Array<ModuleConfig>).push(
        this.selectedArrayItem
      );
      console.log(this.configItems);
      this.keys = [];
      this.configForm = this.fb.group({});
      this.formService.createFormFromConfigItem(
        this.configItems,
        this.configForm,
        this.keys,
        null
      );
      this.isAddNewItem = false;
    }
  }

  getNodeKey(node: any) {
    return node.fullKey;
  }

  addNewItemClicked(key: string) {
    this.isAddNewItem = true;
    this.selectedKey = key;
    let items = this.configItems[key] as Array<ModuleConfig>;
    for (let indx = 0; indx < Object.keys(items[0]).length; indx++) {
      const itemKey = Object.keys(items[0])[indx];
      this.selectedArrayItem[itemKey] = '';
    }
    this.title = 'Add item to ' + key;
    this.keys = [];
    this.configForm = this.fb.group({});
    this.formService.createFormFromConfigItem(
      this.selectedArrayItem,
      this.configForm,
      this.keys,
      null
    );
  }
}
