import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  User,
  RecaptchaVerifier,
  GoogleAuthProvider
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private recaptchaVerifier!: RecaptchaVerifier;

  constructor(private auth: Auth, private router: Router) {}

  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/home']);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getLoggedInUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): Observable<User | null> {
    return new Observable((observer) => {
      this.auth.onAuthStateChanged((user) => {
        observer.next(user);
      });
    });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      localStorage.setItem('user', JSON.stringify(result.user));
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }


  async loginWithPhone(phoneNumber: string) {
    try {
      const confirmation = await signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier);
      const code = prompt("Enter the OTP sent to your phone:");
      if (code) {
        const result = await confirmation.confirm(code);
        localStorage.setItem('user', JSON.stringify(result.user));
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Phone login error:', error);
    }
  }
}
