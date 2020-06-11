import { Injectable } from '@angular/core';
import {Section} from "../models/section";
import {AngularFirestore} from "@angular/fire/firestore";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CourseContentService {

  // Variables just for comunications (Used in sidenav and navbar)
  // Navbar uses to get sidenav info on collapsed state
  sidenavContent: string[] = [];
  sidenavCourseName: string = '';

  // sections: any = {
  //   'Python 1': [new Section('contenido', '', ''),],
  //   'Python 2': [new Section('contenido', '', ''), new Section('prueba', 'o7n-aXtmwB8', '')],
  //   'Python 3': [new Section('contenido', '', ''),],
  //   'Python 4': [new Section('contenido', '', ''),],
  //   'Python 5': [new Section('contenido', '', ''),],
  //   'Python 6': [new Section('contenido', '', ''),],
  //   'Python 7': [new Section('contenido', '', ''),],
  // }

  sections: Section[] = [];

  constructor(private afs: AngularFirestore) {}

  getSectionList(courseName: string) {
    // return this.sections[courseName];
    this.sections = [];
    this.afs.collection('sections', ref => ref.where('courseName', '==', courseName))
      .get().pipe(take(1)).toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // @ts-ignore
          this.sections.push(doc.data())
        })
      })
      .catch(() => console.log('Error :('));
  }

  // getSection(courseName: string, sectionName: string) {
  //   for (let i = 0; i < this.sections[courseName].length; i++) {
  //     if (this.sections[courseName][i].sectionName === sectionName) {
  //       return this.sections[courseName][i];
  //     }
  //   }
  // }

  addSection(courseName: string, section: Section) {
    // this.sections[courseName].push(section);
    // this.sidenavContent.push(section.sectionName);
    // Check if course exist

    const sectionFilename = `${courseName}-${section.sectionName}`;
    return this.afs.collection('sections').doc(sectionFilename).get().toPromise()
      .then(doc => {
        if (doc.exists) {
          return {state: false, msg: 'La sección ya existe'}
        }
        else {
          // Add new course
          return this.afs.collection('sections').doc(sectionFilename)
            .set({...section})
            .then(() => {
              this.sections.push(section);
              return {state: true, msg: 'Agregado correctamente'}
            })
            .catch(() => {return {state: false, msg: 'Error al agregar'}});
        }
      });

  }

  // deleteSection(courseName: string, section: Section){
  //   for (let i = 0; i < this.sections[courseName].length; i++) {
  //     if (this.sections[courseName][i].sectionName === section.sectionName) {
  //       this.sections[courseName].splice(i, 1);
  //       this.sidenavContent.splice(i, 1);
  //       break;
  //     }
  //   }
  // }

  editSection(courseName: string, oldSection: Section, newSection: Section) {
  //   for (let i = 0; i < this.sections[courseName].length; i++) {
  //     if (this.sections[courseName][i].sectionName === oldSection.sectionName) {
  //       this.sections[courseName][i] = newSection;
  //       break;
  //     }
  //   }
    const oldSectionFilename = `${courseName}-${oldSection.sectionName}`;
    console.log('FILENAME:' + oldSectionFilename);
    return this.afs.collection('sections').doc(oldSectionFilename)
      .update({...newSection})
      .then(() => {
        const idx = this.sections.findIndex((section: Section) => section.sectionName == oldSection.sectionName);
        this.sections[idx] = newSection;
        return {state: true, msg: 'Actualizado correctamente'}
      })
      .catch((err) => {
        console.log(err);
        return {state: false, msg: 'Error al actualizar'}
      });
  }

  // updateSectionsCourseName(oldCourseName: string, newCourseName: string) {
  //   for (let section of this.sections) {
  //     const oldSectionFilename = `${oldCourseName}-${section.sectionName}`;
  //     const newectionFilename = `${newCourseName}-${section.sectionName}`;
  //
  //
  //   }
  // }

}
