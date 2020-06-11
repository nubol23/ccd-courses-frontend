import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {Course} from "../../models/course";
import {Section} from "../../models/section";
import {CourseContentService} from "../../services/course-content.service";
import {ActivatedRoute} from "@angular/router";
import {CoursesService} from "../../services/courses.service";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courseName: string;
  sections: Section[] = [];
  course: Course;
  currentSectionIdx: number = 0;

  constructor(public courseContentService: CourseContentService,
              private activatedRoute: ActivatedRoute,
              private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseName = params['title'];
    });

    this.courseContentService.getSectionList(this.courseName);
    this.sections = this.courseContentService.sections;

    this.coursesService.getCourse(this.courseName)
      .then(res => {
        // @ts-ignore
        this.course = res;
      })
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
        title: 'Nombre de la sección',
        inputValue: course === null? '': course.title,
        inputValidator: (inputValue: string) => inputValue === ''? 'No se permiten campos vacíos': ''
      },
      {
        title: 'Id del video de youtube (opcional)',
        inputValue: course === null? '': course.description,
      },
      {
        title: 'Url del livestream (opcional)',
        inputValue: course === null? '': course.description,
      },
    ]).then((result: any) => {
      if (result.value) {
        const values = JSON.parse(JSON.stringify(result.value))
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor'
        });
        Swal.showLoading();
        if (course === null) {
          // We want to add a section
          // values[1] = 'https://www.youtube.com/embed/' + values[1];
          // this.courseContentService.addSection(this.courseName, new Section(values[0], values[1], values[2]));
          this.courseContentService.addSection(this.courseName, new Section(this.courseName, values[0], values[1], values[2]))
            .then(resp => {
              this.responseDialog(resp);
            })
        }
        else
          // We want to edit a section
          console.log('Editando', values);
      }
    })
  }

  addSection() {
    this.alertController(null);
  }

  // getItems() {
  //   // sidenav items name
  //   return this.sections.map((section: Section) => section.sectionName);
  // }

  loadSection (sectionIndex: number) {
    this.currentSectionIdx = sectionIndex;
  }

  //
  // getCourse() {
    // let course = this.coursesService.getCourse(this.courseName);
    // console.log(course);
    // return course;

    // this.coursesService.getCourse(this.courseName)
    //   .then(res => {
    //     // @ts-ignore
    //     this.course = res;
    //   })

    // return this.coursesService.getCourse(this.courseName);
  // }

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
