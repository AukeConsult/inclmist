import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  verificationMessage: string = '';
  isLoading: boolean = false;
  showResendVerification: boolean = false;
  registeredUser: any = null; // Store registered user for resending verification

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    this.errorMessage = ''; // Clear previous errors

    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address!';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    this.isLoading = true;

    try {
      // ✅ Register user but prevent immediate login
      const user = await this.authService.register(this.email, this.password);
      this.registeredUser = user; // Store user for resend email
      this.verificationMessage = 'Registration successful! Please check your email for verification.';

      // ✅ Show resend verification button
      this.showResendVerification = true;
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  // ✅ Function to validate email format
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // ✅ Register with Google
  async registerWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/home']); // Redirect after successful signup
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  // ✅ Resend verification email if the user is stored
  async resendEmailVerification() {
    this.errorMessage = '';
    this.verificationMessage = '';

    if (this.registeredUser) {
      try {
        await this.authService.resendVerificationEmail(this.registeredUser);
        this.verificationMessage = 'A new verification email has been sent!';
      } catch (error: any) {
        this.errorMessage = error.message;
      }
    } else {
      this.errorMessage = 'No user found. Please register first.';
    }
  }

  loginWithMicrosoft() {
    // this.authService.loginWithMicrosoft();
  }

  loginWithApple() {
    // this.authService.loginWithApple();
  }
  loginWithPhone() {
    // this.authService.loginWithApple();
  }
}
