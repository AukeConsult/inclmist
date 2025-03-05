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
  GoogleAuthProvider,
  sendEmailVerification
} from '@angular/fire/auth';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private recaptchaVerifier!: RecaptchaVerifier;

  constructor(public auth: Auth, private router: Router) {}

  async register(email: string, password: string) {
    try {
      // ✅ Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // ✅ Send email verification
      await sendEmailVerification(user);
      console.log('Verification email sent to:', user.email);

      // ✅ Sign the user out immediately to prevent unverified access
      await signOut(this.auth);
      localStorage.removeItem('user');

      return {
        message: 'Registration successful! Please check your email for verification before logging in.',
        success: true
      };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please log in instead.');
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }


  async verifyEmail(user: User) {
    try {
      await sendEmailVerification(user);
      console.log('Verification email sent.');
    } catch (error) {
      console.error('Error sending email verification:', error);
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(this.auth); // ✅ Log out unverified users immediately
        throw new Error('Your email is not verified. Please check your email inbox.');
      }

      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/home']);
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }

  async resendVerificationEmail(user: User) {
    try {
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        console.log('Verification email resent to:', user.email);
        return 'A new verification email has been sent!';
      }
      return 'Your email is already verified!';
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw new Error('Failed to resend verification email. Try again later.');
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
      //this.setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier);
      const code = prompt('Enter the OTP sent to your phone:');

      if (code) {
        const result = await confirmation.confirm(code);
        console.log('Phone login successful:', result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Phone login error:', error);
    }
  }

  // private setupRecaptcha() {
  //   if (!document.getElementById('recaptcha-container')) {
  //     console.error("⚠️ reCAPTCHA container not found! Ensure the <div id='recaptcha-container'></div> exists in your HTML.");
  //     return;
  //   }
  //
  //   this.recaptchaVerifier = new RecaptchaVerifier(
  //     'recaptcha-container',
  //     {
  //       size: 'invisible',
  //       callback: (response: any) => {
  //         console.log('✅ reCAPTCHA solved:', response);
  //       }
  //     },
  //     this.auth
  //   );
  // }
}
