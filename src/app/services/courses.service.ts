import { Injectable } from '@angular/core';
import {Course} from "../models/course";
import {AngularFirestore} from "@angular/fire/firestore";
import Swal from "sweetalert2";
import {Subject} from "rxjs";
import {take} from "rxjs/operators";
import {CourseContentService} from "./course-content.service";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  courses: Course[] = [];
  loadingCourses: boolean;

  constructor(private afs: AngularFirestore,
              private courseContentService: CourseContentService) {
    // this.loadingCourses = true;
    //
    // this.afs.collection('courses').get().toPromise()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       // @ts-ignore
    //       let course: Course = doc.data();
    //       course.uid = doc.id;
    //       this.courses.push(course);
    //     });
    //     this.loadingCourses = false;
    //   });
  }

  loadCourses() {
    this.loadingCourses = true;

    this.afs.collection('courses').get().toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // @ts-ignore
          let course: Course = doc.data();
          course.uid = doc.id;
          this.courses.push(course);
        });
        this.loadingCourses = false;
      });
  }


  // https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1200px-ISO_C%2B%2B_Logo.svg.png
  addCourse(course: Course) {

    // Check if course exist
    // return this.afs.collection('courses').doc(course.uid).get().toPromise()
    //   .then(doc => {
    //     if (doc.exists) {
    //       return {state: false, msg: 'El curso ya existe'}

    // return this.afs.collection('courses', ref => ref.where('uid', '==', course.uid))
    return this.afs.collection('courses', ref => ref.where('title', '==', course.title))
      .get().pipe(take(1)).toPromise()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          return {state: false, msg: 'El curso ya existe'}
        }
        else {
          // Add new course
          // return this.afs.collection('courses').doc(course.uid)
          //   .set({...course})
          return this.afs.collection('courses').add({
            ...course
          })
            .then((docRedf) => {
              course.uid = docRedf.id;
              this.courses.push(course);
              return {state: true, msg: 'Agregado correctament'}
            })
            .catch(() => {return {state: false, msg: 'Error al agregar'}});
        }
    });

  }

  // deleteCourse(courseId: string){
  //   return this.afs.collection('courses').doc(courseId).delete()
  //     .then(() => {
  //
  //       // Delete its sections
  //       console.log('Antes de entrar');
  //       return this.courseContentService.deleteSections(courseId).then(res => {
  //         console.log(res);
  //         if (res['state']) {
  //
  //           // Delete course from list
  //           const idx = this.courses.findIndex((course: Course) => course.uid == courseId);
  //           this.courses.splice(idx, 1);
  //
  //           return {state: true, msg: 'Curso eliminado correctamente'};
  //         }
  //         else {
  //           // return {state: false, msg: 'Error al eliminar'};
  //           return res;
  //         }
  //       })
  //     })
  //     .catch(() => {
  //       return {state: false, msg: 'Error al eliminar'};
  //     });
  // }

  deleteCourse(courseId: string){
    // Delete its sections
    return this.courseContentService.deleteSections(courseId).then(res => {
      if (res['state']) {
        return this.afs.collection('courses').doc(courseId).delete()
          .then(() => {

            // Delete course from list
            const idx = this.courses.findIndex((course: Course) => course.uid == courseId);
            this.courses.splice(idx, 1);

            return {state: true, msg: 'Curso eliminado correctamente'};
        })
        .catch(() => {
          return {state: false, msg: 'Error al eliminar el curso'};
        });
      }
      else {
        return res;
      }
    })
  }

  editCourse(oldCourse: Course, newCourse: Course) {
    return this.afs.collection('courses').doc(oldCourse.uid)
      .update({...newCourse})
      .then(() => {
        const idx = this.courses.findIndex((course: Course) => course.uid == oldCourse.uid);
        this.courses[idx] = newCourse;
        return {state: true, msg: 'Actualizado correctamente'}
      })
      .catch(() => {return {state: false, msg: 'Error al actualizar'}});
  }

  getCourse(courseId: string) {

    return this.afs.collection<Course>('courses').doc(courseId)
      .get().pipe(take(1)).toPromise()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        }
        else {
          // console.log('Falle: ' + courseId)
          return new Course('', '', '');
        }
      })
      .catch(() => new Course('', '', ''));
  }
}
