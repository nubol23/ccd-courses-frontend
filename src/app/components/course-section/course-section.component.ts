import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Section} from "../../models/section";
import {CourseContentService} from "../../services/course-content.service";
import {init} from "protractor/built/launcher";
import Swal from "sweetalert2";
import {Assignment, AssignmentFile} from "../../models/assignment";
import {Course} from "../../models/course";

@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.css']
})
export class CourseSectionComponent implements OnInit ,OnChanges {

  @Input() section: Section;
  @Input() course: Course;
  editable = false;
  // fileToUpload: File = null;
  assignmentFile: AssignmentFile;

  constructor(private activatedRoute: ActivatedRoute,
              private courseContentService: CourseContentService) {
  }

  ngOnInit(): void {
    // console.log(this.course);
  }

  saveEdit() {
    // console.log(this.section.sectionExplanation);
    // this.section.sectionExplanation = this.localMarkdown;
    this.editable = false;

    // TODO: POST A LA DB
    let newSection = new Section(
      this.section.courseId,
      this.section.sectionName,
      this.section.videoId,
      this.section.liveUrl
    );
    newSection.uid = this.section.uid;
    newSection.sectionExplanation = this.section.sectionExplanation;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    this.courseContentService.editSection(this.section,  newSection)
      .then(resp => {
        this.responseDialog(resp);
      })
  }

  startEdit() {
    this.editable = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes['section']);
    // console.log(this.section.sectionExplanation);
    // this.localMarkdown = this.section.sectionExplanation;

    // console.log(this.course);

    // if (this.section.sectionName === 'contenido') {
    //   this.section.sectionExplanation = `
    //   ### Bienvenido/a al curso: ${this.course.title}
    //
    //   ${this.course.description}
    //   `
    // }
  }

  uploadProgrammingAssignment(event) {
    // this.fileToUpload = event.target.files[0];
    // console.log(this.fileToUpload);

    // let assignment: AssignmentFile = new AssignmentFile(this.fileToUpload, this.section.uid+'.html');
    this.assignmentFile = new AssignmentFile(event.target.files[0], this.section.uid+'.html');
    // console.log(this.assignmentFile);

    let res = this.courseContentService.uploadFile(this.section, this.assignmentFile);
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
