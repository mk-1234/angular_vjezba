import { Injectable } from '@angular/core';
import {Post} from "./post.model";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../data.service";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts : Post[] = [];
  postSubject : BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);

  constructor(private http:HttpClient, private dataService:DataService) {
    this.init();
  }

  init() {
    this.dataService.getPosts()
      .subscribe(res  => {
        // @ts-ignore
        this.posts = res;
        console.log(res);
        this.postSubject.next(this.posts);
      });
  }

  getPosts() {
    return this.postSubject;
  }

  addPost(post : Post) {
    this.dataService.addPost(post)
      .subscribe(res => {
        console.log(res);
        // @ts-ignore
        post._id = res;
        this.posts.push(post);
        this.postSubject.next(this.posts);
      });
  }

  getPost(post : Post) {
    return this.posts.find(p =>
      p.comment == post.comment &&
      p.userId == post.userId &&
      p.timestamp == post.timestamp
    );
  }

  deletePost(id : number) {
    console.log('delete id: ' + id);
    this.dataService.deletePost(id)
      .subscribe(res => {
        console.log(res);
        this.posts = this.posts.filter(p => p._id != id);
        this.postSubject.next(this.posts);
      });
  }

  editPost(post : Post, id : number) {
    this.dataService.editPost(post)
      .subscribe(res => {
        this.posts[id] = post;
      })
  }
}
