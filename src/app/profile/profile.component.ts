import { Component, OnInit } from '@angular/core';
import {User} from "../register/user.model";
import {Post} from "../posts/post.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {PostService} from "../posts/post.service";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  posts : Post[] = [];
  postSubject : BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  subscription : Subscription = new Subscription();
  user: User = new User();

  constructor(private postService:PostService, private auth: AuthService) { }

  ngOnInit() {
    this.user._id = this.auth.user._id;
    this.user.username = this.auth.user.username;
    this.user.password = this.auth.user.password;
    this.user.name = this.auth.user.name;
    this.user.email = this.auth.user.email;
    this.user.salt = this.auth.user.salt;

    this.postSubject = this.postService.getPosts();
    this.subscription = this.postSubject
      .subscribe((res: Post[]) => {
        res.filter(p => {
          if (p.userId == this.user.username) this.posts.push(p);
        });
      });
  }

}
