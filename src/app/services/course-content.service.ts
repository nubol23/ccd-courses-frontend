import { Injectable } from '@angular/core';
import {Section} from "../models/section";

@Injectable({
  providedIn: 'root'
})
export class CourseContentService {

  // Variables just for comunications (Used in sidenav and navbar)
  // Navbar uses to get sidenav info on collapsed state
  sidenavContent: string[] = [];
  sidenavCourseName: string = '';

  sections: any = {
    'Python 1': [new Section('contenido', '', ''),],
    'Python 2': [new Section('contenido', '', ''), new Section('prueba', 'o7n-aXtmwB8', '')],
    'Python 3': [new Section('contenido', '', ''),],
    'Python 4': [new Section('contenido', '', ''),],
    'Python 5': [new Section('contenido', '', ''),],
    'Python 6': [new Section('contenido', '', ''),],
    'Python 7': [new Section('contenido', '', ''),],
  }


  constructor() { }

  getSectionList(courseName: string) {
    return this.sections[courseName];
  }

  getSection(courseName: string, sectionName: string) {
    for (let i = 0; i < this.sections[courseName].length; i++) {
      if (this.sections[courseName][i].sectionName === sectionName) {
        return this.sections[courseName][i];
      }
    }
  }

  addSection(courseName: string, section: Section) {
    this.sections[courseName].push(section);
    this.sidenavContent.push(section.sectionName);
  }

  deleteSection(courseName: string, section: Section){
    for (let i = 0; i < this.sections[courseName].length; i++) {
      if (this.sections[courseName][i].sectionName === section.sectionName) {
        this.sections[courseName].splice(i, 1);
        this.sidenavContent.splice(i, 1);
        break;
      }
    }
  }

  editSection(courseName: string, oldSection: Section, newSection: Section) {
    for (let i = 0; i < this.sections[courseName].length; i++) {
      if (this.sections[courseName][i].sectionName === oldSection.sectionName) {
        this.sections[courseName][i] = newSection;
        break;
      }
    }
  }

}
