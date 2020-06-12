import {
  AfterViewChecked,
  AfterViewInit,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
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
export class CourseSectionComponent implements OnInit ,OnChanges, AfterViewChecked {

  @Input() sectionIdx: number;
  @Input() section: Section;
  @Input() course: Course;
  @Output() ngSectionDeleted = new EventEmitter<number>();
  editable = false;
  // fileToUpload: File = null;
  assignmentFile: AssignmentFile;

  onEditBackupSection = Section;
  onEditSectionName: string;

  constructor(private activatedRoute: ActivatedRoute,
              private courseContentService: CourseContentService) {
  }

  ngOnInit(): void {
    // console.log(this.course);
  }

  saveEdit() {
    this.editable = false;

    // Post edition to DB
    // let newSection = new Section(
    //   this.section.courseId,
    //   this.section.sectionName,
    //   this.section.videoId,
    //   this.section.liveUrl
    // );
    // newSection.uid = this.section.uid;
    // newSection.sectionExplanation = this.section.sectionExplanation;
    // newSection.programmingAssignmentUrl = this.section.programmingAssignmentUrl;

    this.section.sectionName = (' ' + this.onEditSectionName).slice(1);

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    // this.courseContentService.editSection(this.section,  newSection)
    this.courseContentService.editSection(this.section)
      .then(resp => {
        this.responseDialog(resp);
      })
  }

  startEdit() {
    this.editable = true;

    // Copy object to backup
    this.onEditBackupSection = JSON.parse(JSON.stringify(this.section));
    this.onEditSectionName = (' ' + this.section.sectionName).slice(1);
  }

  cancelEdit() {
    this.editable = false;

    // Restore object
    this.section = JSON.parse(JSON.stringify(this.onEditBackupSection));
  }

  ngOnChanges(changes: SimpleChanges) {}

  uploadProgrammingAssignment(event) {
    // this.fileToUpload = event.target.files[0];
    // console.log(this.fileToUpload);

    // let assignment: AssignmentFile = new AssignmentFile(this.fileToUpload, this.section.uid+'.html');
    this.assignmentFile = new AssignmentFile(event.target.files[0], this.section.uid+'.html');
    // console.log(this.assignmentFile);

    let res = this.courseContentService.uploadFile(this.section, this.assignmentFile);
  }

  deleteProgrammingAssignment() {
    Swal.fire({
      title: `¿Está seguro/a que desea borrar el ejercicio?`,
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
        this.courseContentService.deleteFile(this.section)
          .then(res => {
            this.responseDialog(res);
          })
          .catch(res => {
            this.responseDialog(res);
          })
      }
    });
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

  ngAfterViewChecked() {
    // Para actualizar los elementos de materialize
    // @ts-ignore
    M.updateTextFields();

    // Inicializar textarea
    try {
      let el = document.getElementById('explanation');
      // @ts-ignore
      M.textareaAutoResize(el);
    }
    catch (e) {
      // Aún no existe
    }
  }

  emmitSectionDeleteEvent() {
    this.ngSectionDeleted.emit(this.sectionIdx);
  }

}
