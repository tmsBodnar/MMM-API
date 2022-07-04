import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Module } from 'src/app/models/Module';

@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.css'],
})
export class RemoveDialogComponent implements OnInit {
  modules: Module[] = [];
  selectedOptions = [];
  selectedOption: Module[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { modules: Module[] },
    public dialogRef: MatDialogRef<RemoveDialogComponent>
  ) {
    this.modules = data.modules;
  }

  ngOnInit(): void {}

  onNgModelChange(event: any) {
    this.selectedOption = event;
  }

  save() {
    this.dialogRef.close(this.selectedOption);
  }
}
