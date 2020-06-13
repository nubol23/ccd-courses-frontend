import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import Swal from "sweetalert2";
import {Location} from "@angular/common";
// import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = "";
  password = "";

  constructor(public auth: AuthService,
              private _location: Location) { }
              // private router: Router) { }

  ngOnInit(): void {
    console.log('Login')
  }

  login(form: NgForm) {
    if (form.invalid) {
      console.log('invalido');
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    //
    // this.auth.login(this.email, this.password)
    //   .subscribe(resp => {
    //     Swal.close();
    //   }, error => {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error',
    //       text: 'Credenciales inválidas'
    //     });
    //   });

    this.auth.login(this.email, this.password)
      .then(res => {
        console.log(res);
        Swal.close();
        // this.router.navigate(['/cursos'])
        //   .then(res => res);
        this._location.back();
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales inválidas'
        });
      });
  }

}
