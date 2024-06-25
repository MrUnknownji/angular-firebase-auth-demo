import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userService = inject(UserService);
  invalidPassword = false;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  toggleButton() {
    this.userService.setRegistered(!this.userService.getIsRegistered());
  }

  onSubmit() {
    this.authService
      .loginWithEmailPassword(
        this.loginForm.value.email!,
        this.loginForm.value.password!
      )
      .then(() => {
        console.log('User Logged In');
        this.userService.setLoggedIn(true);
        this.invalidPassword = false;
      })
      .catch((error) => {
        if (error.message.includes('invalid-credential')) {
          this.invalidPassword = true;
        }
        console.error('Something went wrong: ', error);
      });
  }
}
