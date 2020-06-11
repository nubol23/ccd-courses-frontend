import { Component, OnInit } from '@angular/core';
import {CoursesService} from "../../services/courses.service";
import {Course} from "../../models/course";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];

  constructor(public courseService: CoursesService) { }

  ngOnInit(): void {
    // Load all the courses
    this.courses = this.courseService.courses;
  }

  addCourse() {
    this.alertController(null);
  }

  deleteCard(courseTitle: string) {
    // this.courseService.deleteCourse(this.courses.find((course) => course.title === courseTitle));
    Swal.fire({
      title: `Está seguro/a que desea borrar el curso: ${courseTitle}`,
      icon: 'warning',
      confirmButtonText: 'OK',
      showCancelButton: true,
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
        this.courseService.deleteCourse(courseTitle)
          .then(resp => {
            this.responseDialog(resp);
          })
      }
    });
  }

  editCard(courseTitle: string) {
    this.alertController(this.courses.find((course) => course.title === courseTitle));
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
          this.courseService.editCourse(course, new Course(values[0], values[1], values[2]))
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
}
