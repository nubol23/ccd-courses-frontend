import { Component, OnInit } from '@angular/core';
import {CourseContentService} from "../../services/course-content.service";
import {NavSideSharedService} from "../../services/nav-side-shared.service";
import {AuthService} from "../../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public courseContentService: CourseContentService,
              public navSideSharedService: NavSideSharedService,
              public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  logout() {
    Swal.fire({
      title: `¿Desea cerrar sesión?`,
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
        this.authService.logout()
          .then(res => {
            console.log(res);
            Swal.close();
          })
          .catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Credenciales inválidas'
            });
          });
      }
    });
  }

}
