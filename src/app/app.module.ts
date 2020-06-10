import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { LoginComponent } from './pages/login/login.component';
import { CardComponent } from './components/card/card.component';
import { CourseComponent } from './pages/course/course.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CourseSectionComponent } from './components/course-section/course-section.component';
import { SafeurlPipe } from './pipes/safeurl.pipe';
import {YouTubePlayerModule} from "@angular/youtube-player";
import {FormsModule} from "@angular/forms";
import {MarkdownModule} from "ngx-markdown";
import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/firestore";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CoursesComponent,
    LoginComponent,
    CardComponent,
    CourseComponent,
    SidenavComponent,
    CourseSectionComponent,
    SafeurlPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    YouTubePlayerModule,
    FormsModule,
    MarkdownModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
