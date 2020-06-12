import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavSideSharedService {

  private _selectedSection: number = 0;

  constructor() { }

  get selectedSection(): number {
    return this._selectedSection;
  }

  set selectedSection(value: number) {
    this._selectedSection = value;
  }
}
