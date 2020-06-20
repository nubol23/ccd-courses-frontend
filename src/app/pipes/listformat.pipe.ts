import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listformat'
})
export class ListformatPipe implements PipeTransform {

  transform(value: string): string {
    let res = "";
    let lines = value.split('\n');
    // console.log(lines)

    return res;
  }

}
