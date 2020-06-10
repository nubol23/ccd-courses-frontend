import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Pipe({
  name: 'safeurl'
})
export class SafeurlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }


  transform(value: string): SafeResourceUrl {
    value = 'https://www.youtube.com/embed/' + value;
    console.log(value);
    return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }

}
