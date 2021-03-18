import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) {
  }

  submit() {
    if (this.form.valid) {
      if (this.form.value.username === 'admin' && this.form.value.password === 'admin') {
        const credentialsBase64 = btoa(this.form.value.username + ':' + this.form.value.password);
        this.authService.login(credentialsBase64);
      }
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
