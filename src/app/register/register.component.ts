import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {User} from "./user.model";
import {UserService} from "./user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({
    'username' : new FormControl('', [Validators.required, Validators.minLength(4)]),
    'password' : new FormControl('', Validators.required),
    'repeat-password' : new FormControl('', Validators.required),
    'name' : new FormControl('', Validators.required),
    'email' : new FormControl('', [Validators.required, Validators.email]),
  });

  users : User[] = [];
  wrongPass : boolean = false;

  constructor(private fb : FormBuilder, private userService : UserService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.registerForm.value['password'] != this.registerForm.value['repeat-password']) {
      this.wrongPass = true;
      console.log('passwords are NOT equal');
      console.log('pass: ' + this.registerForm.value['password']);
      console.log('rep-pass: ' + this.registerForm.value['repeat-password']);
    } else {
      console.log('passwords are equal');
      console.log('pass: ' + this.registerForm.value['password']);
      console.log('rep-pass: ' + this.registerForm.value['repeat-password']);
      this.wrongPass = false;
      let newUser = {
        _id: -1,
        username: this.registerForm.value['username'],
        password: this.registerForm.value['password'],
        name: this.registerForm.value['name'],
        email: this.registerForm.value['email'],
        salt: ''
      };
      console.log(newUser);
      this.userService.addUser(newUser)
        .subscribe(res => {
          console.log(res);
          // @ts-ignore
          newUser._id = res;
          this.users.push(newUser);
          this.router.navigate(['login']);
        });
    }
  }

}
