import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {User} from "./register/user.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vjezba7';

  constructor(private auth:AuthService, private router:Router) {
  }

  ngOnInit() {
    //let user = this.auth.getUser();

    this.auth.whoAmI()
      .subscribe(res => {
        if (res == 200) {
          console.log('res je 200!! : ');
          console.log(res);
        } else {
          console.log('res nije 200!! : ');
          console.log(res);
          this.router.navigate(['login']);
        }
      }, (err) => {
        console.log(err);
      });
      /*.subscribe((res : {status : number, user? : User}) => {
        if (res.status==200) {
          console.log(res);
        } else {
          this.router.navigate(['login']);
        }
      }, (err) => {
        console.log(err);
      });*/
  }
}
