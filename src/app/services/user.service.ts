import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private __isRegistered = signal(false);
  private __isLoggedIn = signal(false);
  private accessToken;

  constructor(private router: Router) {
    this.accessToken = localStorage.getItem('token');
    if (this.accessToken != null) {
      this.setLoggedIn(true);
      router.navigate(['/home']);
    }
  }

  setRegistered(v: boolean) {
    this.__isRegistered.set(v);
    this.__isRegistered()
      ? this.router.navigate(['/login'])
      : this.router.navigate(['/signup']);
  }
  getIsRegistered() {
    return this.__isRegistered();
  }
  setLoggedIn(v: boolean) {
    this.__isLoggedIn.set(v);
    this.__isLoggedIn()
      ? this.router.navigate(['/home'])
      : this.router.navigate(['/signup']);
  }
  getIsLoggedIn() {
    return this.__isLoggedIn();
  }
}
