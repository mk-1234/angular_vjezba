import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "./post.model";
import {BehaviorSubject, map, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {PostService} from "./post.service";
import {User} from "../register/user.model";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {

  posts : Post[] = [];
  postSubject : BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  subscription : Subscription = new Subscription();

  newPost : Post = {_id: -1, userId:'', timestamp:new Date(), comment:''};
  editingIndex : number = -1;
  editingPost : Post = {_id: -1, userId:'', timestamp:new Date(), comment:''};

  addingPost : boolean = false;

  user: User = new User();
  authenticated: boolean = false;

  constructor(private http:HttpClient, private postService:PostService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.postSubject = this.postService.getPosts();
    this.subscription = this.postSubject
      .subscribe(res => {
        this.posts = res;
      });
    this.user._id = this.auth.user._id;
    this.user.username = this.auth.user.username;
    this.user.password = this.auth.user.password;
    this.user.name = this.auth.user.name;
    this.user.email = this.auth.user.email;
    this.user.salt = this.auth.user.salt;
    /*this.user = this.auth.getUser();*/
    this.auth.authChange
      .subscribe(res => {
        if (res) {
          /*this.user = this.auth.getUser();*/
          this.user._id = this.auth.user._id;
          this.user.username = this.auth.user.username;
          this.user.password = this.auth.user.password;
          this.user.name = this.auth.user.name;
          this.user.email = this.auth.user.email;
          this.user.salt = this.auth.user.salt;
        } else {
          this.router.navigate(['login']);
        }
      });
    if (this.user.username != '' && this.user != null) {
      this.authenticated = true;
    }
  }

  addPost() {
    this.newPost.userId = this.user.username;
    this.newPost.timestamp = new Date();
    this.postService.addPost(this.newPost);
    this.newPost = new Post();
  }

  deletePost(i : number) {
    let p = this.posts[i];
    this.postService.deletePost(p._id);
  }

  setEdit(i : number) {
    this.editingPost = {...this.posts[i]};
    this.editingIndex = i;
  }

  doneEditing(i : number) {
    this.editingPost.timestamp = new Date();
    this.postService.editPost(this.editingPost, i);
    this.editingIndex = -1;
    this.editingPost = {_id: -1, userId:'', timestamp:new Date(), comment:''};
  }

  logout() {
    this.authenticated = false;
    this.user = new User();
    this.auth.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  delStyle() {
    return {
      'background-color': 'darkred'
    };
  }

  editStyle() {
    return {
      'background-color': 'orange',
      'margin-left': '5px'
    };
  }

  sendStyle() {
    if (!this.newPost.comment) {
      return { 'background-color': 'red', 'color': 'grey' };
    } else {
      return {'background-color': 'green'};
    }
  }

}
