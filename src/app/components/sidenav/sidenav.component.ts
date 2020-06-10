import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CourseContentService} from "../../services/course-content.service";
import {ActivatedRoute} from "@angular/router";
import {Section} from "../../models/section";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  @Input() sections: Section[] = [];
  @Input() courseName: string;
  @Output() ngSectionToLoad = new EventEmitter<number>();
  selectedSection: number = 0;

  constructor(public courseContentService: CourseContentService,
              private activatedRoute: ActivatedRoute) {
    // this.activatedRoute.params.subscribe((params) => this.courseName = params['title']);\
  }

  ngOnInit(): void {
    // this.courseContentService.sidenavContent = this.items;
    // this.courseContentService.sidenavCourseName = this.courseName;
  }

  ngOnDestroy() {
    // this.courseContentService.sidenavContent = [];
    // this.courseContentService.sidenavCourseName = '';
  }

  emitSection(sectionIndex: number) {
    this.selectedSection = sectionIndex;
    this.ngSectionToLoad.emit(sectionIndex);
  }

}
