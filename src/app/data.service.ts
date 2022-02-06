import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {Post} from "./posts/post.model";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiRoot = environment.API_URL + '/api/posts';

  constructor(private http:HttpClient) { }


  getPosts(){
    return this.http.get(this.apiRoot);
  }

  addPost(post : Post){
    return this.http.post(this.apiRoot, post);
  }

  deletePost(id : number){
    return this.http.delete(this.apiRoot + `/${id}`);
  }

  editPost(post : Post){
    return this.http.put(this.apiRoot, post);
  }
}
