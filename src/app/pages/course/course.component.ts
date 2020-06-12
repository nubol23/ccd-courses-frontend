import {Component, OnDestroy, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {Course} from "../../models/course";
import {Section} from "../../models/section";
import {CourseContentService} from "../../services/course-content.service";
import {ActivatedRoute} from "@angular/router";
import {CoursesService} from "../../services/courses.service";
import {NavSideSharedService} from "../../services/nav-side-shared.service";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, OnDestroy {

  courseId: string;
  sections: Section[] = [];
  course: Course;
  // currentSectionIdx: number = 0;

  onNavbarEdit: boolean;

  constructor(public courseContentService: CourseContentService,
              private activatedRoute: ActivatedRoute,
              private coursesService: CoursesService,
              public navSideSharedService: NavSideSharedService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = params['uid'];
    });

    this.courseContentService.getSectionList(this.courseId)
      .then(res => {
        console.log('Ya cargué');
        this.sections = this.courseContentService.sections;
      })

    this.coursesService.getCourse(this.courseId)
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
          this.courseContentService.addSection(new Section(this.courseId, values[0], values[1], values[2]))
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

  loadSection (sectionIndex: number) {
    // this.currentSectionIdx = sectionIndex;
    this.navSideSharedService.selectedSection = sectionIndex;
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

  deleteSection(sectionIdx) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();

    if (sectionIdx == this.sections.length-1) {
      // Goto next element
      // this.currentSectionIdx = 0;
      this.navSideSharedService.selectedSection;
    }
    else {
      // Got to start if at end
      // this.currentSectionIdx = sectionIdx;
      this.navSideSharedService.selectedSection;
    }
    // Delete the section
    this.courseContentService.deleteSection(this.sections[sectionIdx].uid)
      .then(resp => {
        this.responseDialog(resp);
      })
  }

  startNavbarEdit() {
    this.onNavbarEdit = true;
    this.courseContentService.backupSectionIndexes();
  }

  endNavbarEdit() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();

    this.onNavbarEdit = false;
    this.responseDialog(this.courseContentService.updateSectionIndexes());
  }

  ngOnDestroy() {
    this.courseContentService.cleanSectionsList();
  }
}
