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
  sendEmailVerification, updateProfile, updatePassword, updateEmail, onAuthStateChanged
} from '@angular/fire/auth';
import { AppUser } from 'shared-library/src';

import { Router } from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private recaptchaVerifier!: RecaptchaVerifier;
  private userSubject: BehaviorSubject<AppUser | null> = new BehaviorSubject<AppUser | null>(null);

  constructor(private auth: Auth, private router : Router, private firestore : Firestore) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        const appUser: {
          uid: string;
          photoURL: string;
          emailVerified: boolean;
          phoneNumber: string;
          displayName: string;
          email: string
        } = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        };
        this.userSubject.next(appUser);
      } else {
        this.userSubject.next(null);
      }
    });
  }


  getLoggedInUser(): Observable<AppUser | null> {
    return this.userSubject.asObservable();
  }

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
  async updateUserInfo(displayName: string, phoneNumber: string, email: string, password?: string) {
    const user = this.auth.currentUser;
    if (user) {
      try {
        // ✅ Update Firebase Auth Profile (only displayName)
        await updateProfile(user, { displayName });

        // ✅ Update email if changed
        if (email && user.email !== email) {
          await updateEmail(user, email);
        }

        // ✅ Update password if provided
        if (password) {
          await updatePassword(user, password);
        }

        // ✅ Store phone number separately in Firestore
        await setDoc(doc(this.firestore, `users/${user.uid}`), {
          phoneNumber: phoneNumber,
          email: email
        }, { merge: true });

        console.log('User profile & Firestore data updated successfully');
        return { success: true, message: 'User updated successfully!' };
      } catch (error: any) {
        console.error('Error updating user:', error);
        throw new Error(error.message || 'Failed to update user');
      }
    } else {
      throw new Error('No user is logged in');
    }
  }


  async getUserPhoneNumber(uid: string): Promise<string | null> {
    try {
      const docRef = doc(this.firestore, `users/${uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data()['phoneNumber'] || null; // ✅ Access via index signature
      } else {
        console.warn('No Firestore document found for user:', uid);
        return null;
      }
    } catch (error) {
      console.error('Error fetching phone number:', error);
      return null;
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
