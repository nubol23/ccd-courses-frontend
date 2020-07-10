import {AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CourseContentService} from "../../services/course-content.service";
import {ActivatedRoute} from "@angular/router";
import {Section} from "../../models/section";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {NavSideSharedService} from "../../services/nav-side-shared.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{

  @Input() onNavbarEdit: boolean;
  @Input() selectedSection: number;
  @Input() sections: Section[] = [];
  @Input() courseId: string;
  @Output() ngSectionToLoad = new EventEmitter<number>();
  // selectedSection: number = 0; // Auto select first section by default

  finishedSections: boolean[];

  constructor(public courseContentService: CourseContentService,
              private activatedRoute: ActivatedRoute,
              private navSideSharedService: NavSideSharedService,
              public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  emitSection(sectionIndex: number) {
    this.navSideSharedService.selectedSection = sectionIndex;

    this.selectedSection = sectionIndex;
    this.ngSectionToLoad.emit(sectionIndex);
  }

  drop(event: CdkDragDrop<Section[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

  isSectionFinished(sectionId: string) {
    if (this.authService.loggedUser.signedIn && this.authService.loggedUser.finishedSections) {
      // for (let finishedSection of this.authService.loggedUser.finishedSections) {
      //   if (finishedSection == sectionId)
      //     return true;
      // }
      if (this.authService.loggedUser.finishedSections[sectionId])
        return true;
    }
    return false;
  }

  // ngAfterViewChecked() {
    // // Inicializar sidenav
    // try {
    //   let el = document.getElementsByClassName('.sidenav');
    //   // @ts-ignore
    //   M.Sidenav.init(el, options);
    // }
    // catch (e) {
    //   // Aún no existe
    // }
  // }
}
