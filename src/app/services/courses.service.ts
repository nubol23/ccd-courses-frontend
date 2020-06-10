import { Injectable } from '@angular/core';
import {Course} from "../models/course";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  courses: Course[] = [
    new Course('Python 1', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
    new Course('Python 2', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
    new Course('Python 3', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
    new Course('Python 4', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
    new Course('Python 5', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
    new Course('Python 6', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png'),
    new Course('Python 7', 'test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png')
  ];
  // courses: [string, Course][] = [];

  constructor(private firestore: AngularFirestore) { }

  getCoursesList() {
    return this.courses;
    // return this.firestore.collection('courses').snapshotChanges();
  }

  // https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1200px-ISO_C%2B%2B_Logo.svg.png
  addCourse(course: Course) {
    this.courses.push(course);
    // console.log(course);
    // return new Promise<any>((resolve, reject) => {
    //   this.firestore
    //     .collection('courses')
    //     .add({...course})
    //     .then(res => console.log('Agregado correctamente'), err => reject(err));
    // })
  }

  deleteCourse(course: Course){
    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses[i].title === course.title) {
        this.courses.splice(i, 1);
        break;
      }
    }
  }

  editCourse(oldCourse: Course, newCourse: Course) {
    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses[i].title === oldCourse.title) {
        this.courses[i] = newCourse;
        break;
      }
    }
  }

  getCourse(courseName: string) {
    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses[i].title === courseName) {
        return this.courses[i];
      }
    }
  }
}
