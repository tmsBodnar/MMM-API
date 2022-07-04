import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labelformatter',
})
export class LabelformatterPipe implements PipeTransform {
  regexForIndex = new RegExp(/([.]\d)/);

  transform(value: string, ...args: unknown[]): string {
    let resultOfIndexSearch = this.regexForIndex.exec(value);
    if (resultOfIndexSearch) {
      const index = Number(value.charAt(resultOfIndexSearch.index + 1)) + 1;
      value = value.replace(
        value.charAt(resultOfIndexSearch.index + 1),
        index + ''
      );
    }
    value = value.split('.').join('\n');
    return value;
  }
}
