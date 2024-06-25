import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  userService = inject(UserService);

  signUpForm = this.formBuilder.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: passwordMatchValidator }
  );

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  toggleButton() {
    this.userService.setRegistered(!this.userService.getIsRegistered());
  }

  register() {
    this.authService
      .createUser(this.signUpForm.value.email!, this.signUpForm.value.password!, this.signUpForm.value.name!)
      .then(() => {
        console.log('User registered');
        this.userService.setLoggedIn(true);
      })
      .catch((error) => {
        if (error.message.includes('email-already-in-use')) {
          console.error('Email is already in use. Try LogIn');
          this.userService.setRegistered(true);
        } else {
          console.error('Something went wrong: ', error);
        }
      });
    this.signUpForm.setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  }
}

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  } else {
    return null;
  }
};
