import { Component, OnInit } from '@angular/core';
import {CourseContentService} from "../../services/course-content.service";
import {NavSideSharedService} from "../../services/nav-side-shared.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public courseContentService: CourseContentService,
              public navSideSharedService: NavSideSharedService) { }

  ngOnInit(): void {
  }

}
