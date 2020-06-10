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
    this.courses = this.courseService.getCoursesList();
    console.log('Cursos')
  }

  addCourse() {
    this.alertController(null);
  }

  deleteCard(courseTitle: string) {
    this.courseService.deleteCourse(this.courses.find((course) => course.title === courseTitle));
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
        const values = JSON.parse(JSON.stringify(result.value))
        let errFlag = false
        if (!errFlag) {
          if (course === null)
            // We want to add a course
            this.courseService.addCourse(new Course(values[0], values[1], values[2]))
          else
            // We want to edit a course
            this.courseService.editCourse(course, new Course(values[0], values[1], values[2]))

          Swal.fire({
            title: 'Todo correcto',
            text: 'Curso agregado correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#00ce89'
          })
        }
      }
    })
  }

}
