import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Module } from '../../../models/Module';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  module: Module;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Module) {
    this.module = data;
    console.log(this.module);
   }

  ngOnInit(): void {
  }

}
