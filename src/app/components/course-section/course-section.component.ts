import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Section} from "../../models/section";
import {CourseContentService} from "../../services/course-content.service";
import {init} from "protractor/built/launcher";
import Swal from "sweetalert2";
import {Assignment} from "../../models/assignment";
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
  fileToUpload: File = null;

  constructor(private activatedRoute: ActivatedRoute,
              private courseContentService: CourseContentService) {
  }

  ngOnInit(): void {
  }

  saveEdit() {
    // console.log(this.section.sectionExplanation);
    // this.section.sectionExplanation = this.localMarkdown;
    this.editable = false;

    // TODO: POST A LA DB
  }

  startEdit() {
    this.editable = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes['section']);
    // console.log(this.section.sectionExplanation);
    // this.localMarkdown = this.section.sectionExplanation;

    console.log(this.course);

    if (this.section.sectionName === 'contenido') {
      this.section.sectionExplanation = `
      ### Bienvenido/a al curso: ${this.course.title}

      ${this.course.description}
      `
    }
  }

  uploadProgrammingAssignment(event) {
    this.fileToUpload = event.target.files[0];
    console.log(this.fileToUpload);
  }



}
