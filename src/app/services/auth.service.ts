import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, take} from "rxjs/operators";
import {auth} from "firebase";
import {QueryUser, User} from "../models/user";
import {AngularFirestore} from "@angular/fire/firestore";
import {query} from "@angular/animations";
// import 'firebase/auth';

// import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // signedIn: boolean;
  loggedUser: User = new User('', '', '', '', false);

  constructor(private http: HttpClient,
              private afs: AngularFirestore) {

    // this.loggedUser = new User('', '', '', '', false);

    // Check any change in the user state
    auth().onAuthStateChanged(user => {
      if (user) {
        this.loggedUser.signedIn = true;
        this.getExtendedUserInfo(user.uid).then(queryUser => {
          this.loggedUser.uid = user.uid;
          this.loggedUser.mail = user.email;
          this.loggedUser.name = queryUser.name;
          this.loggedUser.role = queryUser.role;
          this.loggedUser.finishedSections = queryUser.finishedSections;
          console.log(this.loggedUser);
        })
        // this.signedIn = true;
      }
      else {
        // this.signedIn = false;
        this.loggedUser.signedIn = false;
      }
    });
  }

  getExtendedUserInfo(uid: string) {
    return this.afs.collection('users', ref => ref.where('uid', '==', uid))
      .get().pipe(take(1)).toPromise()
      .then((querySnapshot) => {
        let queryUser: QueryUser;
        querySnapshot.forEach((doc) => {
          // @ts-ignore
          // Only extract the first element
          queryUser = doc.data();
        })
        return queryUser;
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

    // return firebase.auth().signInWithEmailAndPassword(email, password);
    return auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    // return firebase.auth().signOut();
    return auth().signOut();
  }

  getToken() {
    return auth().currentUser.getIdToken(true);
  }

  resetPassword(email: string) {
    return auth().sendPasswordResetEmail(email);
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
