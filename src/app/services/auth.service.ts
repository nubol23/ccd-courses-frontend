import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

import * as firebase from "firebase";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?';
  // private apikey = 'AIzaSyDQKULzc31f6_rCxC2N9HRuTmEo7nKutuE';
  // userToken: string;
  signedIn: boolean;

  constructor(private http: HttpClient) {
    // firebase.initializeApp(environment.firebaseConfig);\

    // console.log(firebase.auth());
    // this.readToken();

    // firebase.auth().setPersistence()
    console.log('Inicie');

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.signedIn = true;
        console.log('signed in', this.signedIn);
      }
      else {
        this.signedIn = false;
      }
    });
  }

  login(email: string, password: string) {
    // let authData = {
    //   email: email,
    //   password: password,
    //   returnSecureToken: true
    // };
    //
    // return this.http.post(`${this.url}key=${this.apikey}`, authData)
    //   .pipe(map(resp => {
    //     this.saveToken(resp['idToken']);
    //     return resp;
    //   }));

    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    return firebase.auth().signOut();
  }

  // saveToken(idToken: string) {
  //   this.userToken = idToken;
  //   localStorage.setItem('token', idToken);
  //
  //   let now = new Date();
  //   now.setSeconds(3600);
  //
  //   localStorage.setItem('expires', now.getTime().toString());
  // }
  //
  // readToken() {
  //   if (localStorage.getItem('token')) {
  //     this.userToken = localStorage.getItem('token');
  //   } else {
  //     this.userToken = '';
  //   }
  //
  //   return this.userToken;
  // }
  //
  // isAuthenticated(): boolean {
  //   if (this.userToken.length < 2) {
  //     return false;
  //   }
  //
  //   const expires = Number(localStorage.getItem('expires'));
  //
  //   const expiresDate = new Date();
  //   expiresDate.setTime(expires);
  //
  //   if (expiresDate > new Date()) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }
}
