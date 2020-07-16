import { Component, OnInit } from '@angular/core';
import {CoursesService} from "../../services/courses.service";
import {Course} from "../../models/course";

import Swal from 'sweetalert2';
import {CourseContentService} from "../../services/course-content.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];

  constructor(public courseService: CoursesService,
              private courseContentService: CourseContentService,
              public authService: AuthService) {
    if (this.courseService.courses.length === 0)
      this.courseService.loadCourses();
  }

  ngOnInit(): void {
    // Load all the courses
    this.courses = this.courseService.courses;

    // console.log(this.courses);
  }

  addCourse() {
    this.alertController(null);
  }

  deleteCard(courseId: string) {
    // this.courseService.deleteCourse(this.courses.find((course) => course.title === courseTitle));
    Swal.fire({
      title: `¿Está seguro/a que desea borrar el curso?`,
      icon: 'warning',
      confirmButtonText: 'SI',
      showCancelButton: true,
      cancelButtonText: "NO",
      confirmButtonColor: '#00ce89',
      cancelButtonColor: '#EF5350'
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor'
        });
        Swal.showLoading();
        this.courseService.deleteCourse(courseId)
          .then(resp => {
            this.responseDialog(resp);
          })
      }
    });
  }

  editCard(courseId: string) {
    this.alertController(this.courses.find((course) => course.uid === courseId));
  }

  alertController(course:Course) {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Siguiente <i class="fas fa-chevron-right"></i>',
      // showCancelButton: true,
      progressSteps: ['1', '2', '3'],
      confirmButtonColor: '#00ce89',
    }).queue([
      {
        title: 'Título del curso',
        inputValue: course === null? '': course.title,
        inputValidator: (inputValue: string) => inputValue === ''? 'No se permiten campos vacíos': ''
      },
      {
        title: 'Descripción del curso',
        inputValue: course === null? '': course.description,
        // @ts-ignore
        input: "textarea",
        inputValidator: (inputValue: string) => inputValue === ''? 'No se permiten campos vacíos': ''
      },
      {
        title: 'Imágen',
        text: 'Link a la imágen para el logo del curso',
        inputValue: course === null? '': course.coverUrl,
        inputValidator: (inputValue: string) => inputValue === ''? 'No se permiten campos vacíos': ''
      }
    ]).then((result: any) => {
      if (result.value) {
        // Evaluate input values
        const values = JSON.parse(JSON.stringify(result.value))
        // Show loading while action is performing
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor'
        });
        Swal.showLoading();
        // Check which action to perform
        if (course === null) {
          // We want to add a course
          this.courseService.addCourse(new Course(values[0], values[1], values[2]))
            .then(resp => {
              this.responseDialog(resp);
            })
        }
        else {
          // We want to edit a course
          let newCourse = new Course(values[0], values[1], values[2]);
          newCourse.uid = course.uid
          this.courseService.editCourse(course, newCourse)
            .then(resp => {
              this.responseDialog(resp);
            })
        }
      }
    })
  }

  responseDialog(resp: {state: boolean, msg: string}) {
    Swal.fire({
      title: resp.state? 'Todo correcto': 'Error',
      text: resp.msg,
      icon: resp.state? 'success': 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#00ce89'
    })
  }

  // tempDel() {
  //   this.courseContentService.deleteSections('VJKP7bLjdSVpLu8stUeD');
  // }
}
