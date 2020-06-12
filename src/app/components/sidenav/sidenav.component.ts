import {AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CourseContentService} from "../../services/course-content.service";
import {ActivatedRoute} from "@angular/router";
import {Section} from "../../models/section";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {NavSideSharedService} from "../../services/nav-side-shared.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() onNavbarEdit: boolean;
  @Input() selectedSection: number;
  @Input() sections: Section[] = [];
  @Input() courseId: string;
  @Output() ngSectionToLoad = new EventEmitter<number>();
  // selectedSection: number = 0; // Auto select first section by default

  constructor(public courseContentService: CourseContentService,
              private activatedRoute: ActivatedRoute,
              private navSideSharedService: NavSideSharedService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  emitSection(sectionIndex: number) {
    this.navSideSharedService.selectedSection = sectionIndex;

    this.selectedSection = sectionIndex;
    this.ngSectionToLoad.emit(sectionIndex);
  }

  drop(event: CdkDragDrop<Section[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

  ngAfterViewChecked() {
    // // Inicializar sidenav
    // try {
    //   let el = document.getElementsByClassName('.sidenav');
    //   // @ts-ignore
    //   M.Sidenav.init(el, options);
    // }
    // catch (e) {
    //   // Aún no existe
    // }
  }
}
