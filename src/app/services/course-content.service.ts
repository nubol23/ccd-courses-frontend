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

  sectionsIndexesBackup: number[] = [];
  sections: Section[] = [];
  folderName: string = 'exercises'

  constructor(private afs: AngularFirestore) {}

  getSectionList(courseId: string) {
    // while (this.sections.length) { this.sections.pop(); }
    this.cleanSectionsList();
    return this.afs.collection('sections', ref =>
      // ref.where('courseId', '==', courseId).orderBy('creationDate'))
      ref.where('courseId', '==', courseId).orderBy('arrayIdx'))
      .get().pipe(take(1)).toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // @ts-ignore
          let section: Section = doc.data();
          section.uid = doc.id;
          this.sections.push(section)
        })

        return {state: true, msg: 'Cargado correctamente'}
      })
      .catch((err) => {
        console.log('AA:', err);
        return {state: false, msg: 'Error al cargar secciones'}
      });
  }

  cleanSectionsList() {
    while (this.sections.length) { this.sections.pop(); }
  }

  addSection(section: Section) {
    if (this.sections.length === 0) {
      section.arrayIdx = 0;
    }
    else {
      section.arrayIdx = Math.max(...this.sections.map(s => s.arrayIdx)) + 1;
    }

    return this.afs.collection('sections', ref => ref
      .where('sectionName', '==', section.sectionName)
      .where('courseId', '==', section.courseId))
      .get().pipe(take(1)).toPromise()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          return {state: false, msg: 'La sección ya existe'}
        }
        else {
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

  // private _deleteSectionHelper(sectionId: string, idx: number) {
  //   return this.afs.collection('sections').doc(sectionId).delete()
  //     .then(() => {
  //       this.sections.splice(idx, 1);
  //       return {state: true, msg: 'La sección fue eliminada correctamente'};
  //     })
  //     .catch(() => {
  //       return {state: false, msg: 'Error al eliminar la sección'};
  //     });
  // }

  private _deleteSectionHelper(sectionId: string, idx: number) {
    return this.afs.collection('sections').doc(sectionId).delete()
      .then(() => {
        this.sections.splice(idx, 1);
        return {state: true, msg: 'La sección fue eliminada correctamente'};
      })
      .catch(() => {
        return {state: false, msg: 'Error al eliminar la sección'};
      });
  }

  deleteSection(sectionId: string){
    const idx = this.sections.findIndex((section: Section) => section.uid == sectionId);

    if (this.sections[idx].programmingAssignmentUrl) {
      return this.deleteFile(this.sections[idx])
        .then(res => {
          if (res['state']) {
            return this._deleteSectionHelper(sectionId, idx).then(res => res).catch(res => res);
          } else
            return res;
        })
        .catch(res => {
          return {state: false, msg: 'Error al eliminar la sección, porque no se pudo eliminar el ejercicio'};
        })
    }
    else {
      return this._deleteSectionHelper(sectionId, idx).then(res => res).catch(res => res);
    }
  }

  deleteSections(courseId) {
    console.log('Entre');

    return this.getSectionList(courseId)
      .then(res => {
        if (res['state']) {

          let flag = true;
          for (let tempSection of this.sections) {
            console.log('Bucle');
            this.deleteSection(tempSection.uid)
              .then(resp => {
                flag = flag && resp['state'];
              })
          }

          return flag? {state: true, msg: 'Secciones eliminadas'}: {state: false, msg: 'Error al eliminar alguna sección'};
        }
        else {
          return {state: false, msg: 'Error al eliminar las secciones'};
        }
      })
  }

  // editSection(oldSection: Section, newSection: Section) {
    // return this.afs.collection('sections').doc(oldSection.uid)
  editSection(newSection: Section) {
    return this.afs.collection('sections').doc(newSection.uid)
      .update({...newSection})
      .then(() => {
        // const idx = this.sections.findIndex((section: Section) => section.uid == oldSection.uid);
        const idx = this.sections.findIndex((section: Section) => section.uid == newSection.uid);
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
            // this.editSection(section, section)
            this.editSection(section)
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


  deleteFile(section: Section) {
    return firebase.storage().ref().child(`${this.folderName}/${section.uid+'.html'}`).delete()
      .then(res => {
        section.programmingAssignmentUrl = "";
        return this.editSection(section)
          .then(res => {
            if (res['state'])
              return {state: true, msg: 'Ejercicio eliminado correctamente'};
            else
              return res;
          })
          .catch(res => {
            return {state: false, msg: 'Error al eliminar ejercicio, no se pudo actualizar la sección'};
          })
      })
      .catch(res => {
        return {state: false, msg: 'Error al eliminar ejercicio'};
      })
  }

  backupSectionIndexes() {
    this.sectionsIndexesBackup = this.sections.map(s => s.arrayIdx);
  }

  updateSectionIndexes() {
    let flag = true;
    for (let i = 0; i < this.sections.length; i++) {
      if (this.sections[i].arrayIdx !== this.sectionsIndexesBackup[i]) {
        let temp = {...this.sections[i]};
        temp.arrayIdx = i;

        this.editSection(temp)
          .then(resp => {
          flag = flag && resp['state'];
        })
      }
    }

    return flag? {state: true, msg: 'Secciones ordenadas'}: {state: false, msg: 'Error al ordenar las secciones'};
  }

}
