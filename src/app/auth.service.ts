import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { User } from "./register/user.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user : User = new User();
  private token : string = '';
  errorEmitter : Subject<string> = new Subject<string>();
  authChange : Subject<boolean> = new Subject<boolean>();
  authUrl : string = environment.API_URL + '/authenticate';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials : {username : string, password : string}) {
    console.log(credentials);
    console.log('username: ' + credentials.username);
    console.log('password: ' + credentials.password);
    this.http.post<{status : number, description : string, user? : User, token? : string}>(this.authUrl, credentials)
      .subscribe((res : {status : number, description : string, user? : User, token? : string}) => {
        console.log(res);
        if (res.status == 200){
          console.log('before res.user in auth service .post .subscribe');
          console.log(res.user);
          if (res.user) this.user = res.user;
          if (res.token) this.token = res.token;
          console.log('after setting user and token (if they exist) in auth service .post .subscribe');
          console.log(this.user);
          console.log(this.token);
          console.log('after console log of user and token');
          sessionStorage.setItem('token', this.token);
          this.authChange.next(true);
          this.router.navigate(['/']);
        } else {
          this.errorEmitter.next(res.description)
        }
      })
  }

  logout() {
    this.user = new User();
    this.token = '';
    sessionStorage.removeItem('token');
    this.authChange.next(false);
    this.router.navigate(['login']);
  }

  getUser() {
    if (this.user) {
      return {...this.user};
    } else {
      return null;
    }
  }

  getToken(){
    if (this.token) {
      return this.token;
    } else {
      if (sessionStorage.getItem('token')) {
        // @ts-ignore
        this.token = sessionStorage.getItem('token');
        return this.token;
      } else {
        return null;
      }
    }
  }


  isAuthenticated() {
    return this.user != null && this.user.username != '';
  }

  whoAmI() {
    if (this.getToken()) {
      return this.http.get<{status: number, user?: User}>(environment.API_URL + '/api/me')
        .pipe(map((res: { status: number, user?: User }) => {
          if (res.status == 200) {
            console.log('before res and res.user in whoami function');
            console.log(res);
            console.log(res.user);
            console.log('after res.user in whoami function');
            if (res.user) this.user = res.user;
            console.log(this.user);
            console.log('after this.user in whoami function');
            this.authChange.next(true);
          }
          return res.status;
        }))

    } else {
      return new Observable(observer => {
        observer.next({status:100})
      });
    }
  }
}
