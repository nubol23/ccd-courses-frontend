import { Injectable } from '@angular/core';
import {Section} from "../models/section";
import {AngularFirestore} from "@angular/fire/firestore";
import {take} from "rxjs/operators";
import Swal from "sweetalert2";
import * as firebase from "firebase";
import {AssignmentFile} from "../models/assignment";

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
  folderName: string = 'exercises'

  constructor(private afs: AngularFirestore) {}

  getSectionList(courseId: string) {
    while (this.sections.length) { this.sections.pop(); }
    this.afs.collection('sections', ref => ref.where('courseId', '==', courseId))
      .get().pipe(take(1)).toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // @ts-ignore
          let section: Section = doc.data();
          section.uid = doc.id;
          this.sections.push(section)
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

  addSection(section: Section) {
    // this.sections[courseName].push(section);
    // this.sidenavContent.push(section.sectionName);
    // Check if course exist

    // const sectionFilename = `${courseId}-${section.sectionName}`;
    // return this.afs.collection('sections').doc(sectionFilename).get().toPromise()
    //   .then(doc => {
    //     if (doc.exists) {
    //       return {state: false, msg: 'La sección ya existe'}
    // console.log('id: ' + section.uid)
    return this.afs.collection('sections', ref => ref.where('sectionName', '==', section.sectionName))
      .get().pipe(take(1)).toPromise()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          // querySnapshot.forEach(doc => {
          //   console.log('id-2: ' + doc)
          // })
          return {state: false, msg: 'La sección ya existe'}
        }
        else {
          // Add new course
          // return this.afs.collection('sections').doc(sectionFilename)
          //   .set({...section})
          return this.afs.collection('sections').add({
            ...section
          })
            .then((docRef) => {
              section.uid = docRef.id;
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

  editSection(oldSection: Section, newSection: Section) {
  //   for (let i = 0; i < this.sections[courseName].length; i++) {
  //     if (this.sections[courseName][i].sectionName === oldSection.sectionName) {
  //       this.sections[courseName][i] = newSection;
  //       break;
  //     }
  //   }

  //   const oldSectionFilename = `${courseId}-${oldSection.sectionName}`;
  //   console.log('FILENAME:' + oldSectionFilename);
  //   return this.afs.collection('sections').doc(oldSectionFilename)
    return this.afs.collection('sections').doc(oldSection.uid)
      .update({...newSection})
      .then(() => {
        const idx = this.sections.findIndex((section: Section) => section.uid == oldSection.uid);
        this.sections[idx] = newSection;
        return {state: true, msg: 'Actualizado correctamente'}
      })
      .catch((err) => {
        console.log(err);
        return {state: false, msg: 'Error al actualizar'}
      });
  }

  uploadFile(section: Section, html: AssignmentFile) {
    const storageRef = firebase.storage().ref();

    html.uploading = true;

    const uploadTask: firebase.storage.UploadTask = storageRef.child(`${this.folderName}/${html.filename}`)
      .put(html.file);

    return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        html.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        // return {state: false, msg: 'Error al cargar archivo'};
        console.log('Error al subir', error)
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar el archivo',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#00ce89'
        })
      },
      () => {
        console.log('Documento cargado correctamente');
        // return uploadTask.snapshot.ref.getDownloadURL()
        uploadTask.snapshot.ref.getDownloadURL()
          .then((url) => {
            html.url = url;
            html.uploading = false;
            section.programmingAssignmentUrl = html.url;
            this.editSection(section, section)
              .then(res => {
                Swal.fire({
                  title: 'Todo correcto',
                  text: 'Archivo cargado exitosamente',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#00ce89'
                })
                // return {state: true, msg: 'Archivo cargado correctamente'};
              })
              // .catch(() => {return {state: false, msg: 'Error al cargar archivo'}});
            // return {state: true, msg: 'Archivo cargado correctamente'};
          })
          // .catch(() => {return {state: false, msg: 'Error al cargar archivo'}});
      });
    }
}
