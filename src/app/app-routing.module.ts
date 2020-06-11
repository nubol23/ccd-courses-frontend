import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {CoursesComponent} from "./pages/courses/courses.component";
import {LoginComponent} from "./pages/login/login.component";
import {CourseComponent} from "./pages/course/course.component";
import {CourseSectionComponent} from "./components/course-section/course-section.component";


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'cursos', component: CoursesComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cursos/:uid', component: CourseComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
