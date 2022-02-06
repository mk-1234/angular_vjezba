import { Component, OnInit } from '@angular/core';
import {User} from "../register/user.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {UserService} from "../register/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    'username' : new FormControl('', Validators.required),
    'password' : new FormControl('', Validators.required)
  });

  users : User[] = [];
  errorMsg: string = '';

  constructor(private http: HttpClient, private fb:FormBuilder, private auth: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers()
      .pipe(map((res) => {
        const users = [];
        for (let key in res) {
          console.log('key: ' + key);
          // @ts-ignore
          users.push({...res[key]});
        }
        console.log('const users in pipe');
        console.log(users);
        console.log('after consts users');
        return users;
      }))
      .subscribe((res : User[]) => {
        console.log('res in getusers subscribe');
        console.log(res);
        console.log('after res in getusers subscribe and before this.users');
        this.users = res;
        console.log(this.users);
        console.log('after this.users in console');
      });
  }

  onLogin() {
    this.auth.login(this.loginForm.value);
  }

}
