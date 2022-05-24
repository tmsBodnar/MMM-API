import { Pipe, PipeTransform } from '@angular/core';
import { Module } from '../models/Module';

@Pipe({
  name: 'moduleFilter'
})
export class ModulePipe implements PipeTransform {

  transform(values: any[], className: string): any[] {
    console.log(values, className);
    return values.filter(m => m.position === className) ;
  }

}
