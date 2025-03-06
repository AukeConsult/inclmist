import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RecaptchaModule, RouterLink]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showResendVerification: boolean = false;
  user: any = null; // Store the user for resending verification

  @ViewChild('recaptchaRef') recaptchaRef!: RecaptchaComponent;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Both email and password are required!';
      return;
    }

    try {
      const user = await this.authService.login(this.email, this.password);
      this.user = user; // Store user if needed for resending verification
    } catch (error: any) {
      this.errorMessage = error.message;

      // ✅ Show "Resend Verification Email" button if user is unverified
      if (error.message.includes('not verified')) {
        this.showResendVerification = true;
      }
    }
  }

  async resendVerificationEmail() {
    this.errorMessage = '';

    if (this.user) {
      try {
        await this.authService.resendVerificationEmail(this.user);
        this.errorMessage = 'A new verification email has been sent!';
        this.showResendVerification = false; // Hide the button after sending
      } catch (error: any) {
        this.errorMessage = 'Failed to resend verification email. Try again later.';
      }
    } else {
      this.errorMessage = 'No user found. Please log in first.';
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
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
