import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "./user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersUrl = environment.API_URL + '/api/users';
  authUrl = environment.API_URL + '/authenticate';

  constructor(private http:HttpClient) { }

  getUsers(){
    return this.http.get(this.usersUrl);
  }

  addUser(user : User) {
    return this.http.post(this.authUrl, user);
  }

}
