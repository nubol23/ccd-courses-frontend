import { Injectable } from '@angular/core';
import {Course} from "../models/course";
import {AngularFirestore} from "@angular/fire/firestore";
import Swal from "sweetalert2";
import {Subject} from "rxjs";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  // courses: Course[] = [
  //   new Course('Python 1', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
  //   new Course('Python 2', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
  //   new Course('Python 3', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
  //   new Course('Python 4', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
  //   new Course('Python 5', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
  //   new Course('Python 6', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
  //   new Course('Python 7', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png')
  // ];
  courses: Course[] = [];

  constructor(private afs: AngularFirestore) {
    // Load all the courses on startup
    this.afs.collection('courses').valueChanges()
      .pipe(take(1))  // take operator automatically unsubscribes after passed count
      .subscribe((coursesSnapshot: Course[]) => {
        coursesSnapshot.forEach((coursesData: any) => {
          this.courses.push(coursesData);
        })
      });
  }

  // https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1200px-ISO_C%2B%2B_Logo.svg.png
  addCourse(course: Course) {

    // Check if course exist
    return this.afs.collection('courses').doc(course.title).get().toPromise()
      .then(doc => {
        if (doc.exists) {
          return {state: false, msg: 'El curso ya existe'}
        }
        else {
          // Add new course
          return this.afs.collection('courses').doc(course.title)
            .set({...course})
            .then(() => {
              this.courses.push(course);
              return {state: true, msg: 'Agregado correctament'}
            })
            .catch(() => {return {state: false, msg: 'Error al agregar'}});
        }
    });

  }

  deleteCourse(courseTitle: string){
    return this.afs.collection('courses').doc(courseTitle).delete()
      .then(() => {
        const idx = this.courses.findIndex((course: Course) => course.title == courseTitle);
        this.courses.splice(idx, 1);
        return {state: true, msg: 'Curso eliminado correctamente'};
      })
      .catch(() => {
        return {state: false, msg: 'Error al eliminar'};
      });
  }

  editCourse(oldCourse: Course, newCourse: Course) {
    return this.afs.collection('courses').doc(oldCourse.title)
      .update({...newCourse})
      .then(() => {
        const idx = this.courses.findIndex((course: Course) => course.title == oldCourse.title);
        this.courses[idx] = newCourse;



        return {state: true, msg: 'Actualizado correctamente'}
      })
      .catch(() => {return {state: false, msg: 'Error al actualizar'}});
  }

  getCourse(courseName: string) {

    return this.afs.collection<Course>('courses').doc(courseName)
      .get().pipe(take(1)).toPromise()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        }
        else {
          console.log('Falle: ' + courseName)
          return new Course('', '', '');
        }
      })
      .catch(() => new Course('', '', ''));
  }
}
