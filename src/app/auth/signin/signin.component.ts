import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.authService.signin(new User(this.signinForm.value.username, this.signinForm.value.password))
    .subscribe(
      data => {
        localStorage.setItem('token', data['token']);
        localStorage.setItem('userId', data['userId']);
        localStorage.setItem('admin', data['admin']);
        this.router.navigateByUrl('/trivia');
      }
    );
  }
}
