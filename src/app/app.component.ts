import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {CoursesService} from "./services/courses.service";
import {CourseContentService} from "./services/course-content.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CourseAppMaterialize';

  constructor(public courseService: CoursesService,
              public courseContentService: CourseContentService) {
  }
}
