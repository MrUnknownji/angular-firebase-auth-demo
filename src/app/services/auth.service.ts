import { computed, Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { inject } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: any;
  private auth: Auth = inject(Auth);
  private userService = inject(UserService);
  isReg = computed(() => this.userService.getIsRegistered());
  isLogged = computed(() => this.userService.getIsLoggedIn());

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async logout() {
    return signOut(this.auth)
      .then(() => {
        console.log('User signed out');
        localStorage.clear();
        this.userService.setLoggedIn(false);
      })
      .catch((error) => {
        console.log('Something went wrong.Try again', error);
      });
  }

  getUser() {
    return this.auth.currentUser;
  }

  async createUser(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      this.accessToken = (await user.getIdTokenResult(true)).token;
      localStorage.setItem('token', this.accessToken);
      localStorage.setItem('userName', name);
      return {
        email: user.email,
        token: this.accessToken,
        displayName: name,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async loginWithEmailPassword(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      async (userCradential) => {
        this.accessToken = (
          await userCradential.user.getIdTokenResult(true)
        ).token;
        localStorage.setItem('token', this.accessToken);
        let userName1 = email.split('@');
        userName1.pop();
        let userName = userName1.join('');
        localStorage.setItem('userName', userName);
      }
    );
  }

  isLoggedIn(): boolean {
    return this.isLogged();
  }

  isRegistered(): boolean {
    return this.isReg();
  }
}
