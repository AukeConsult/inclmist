import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  phoneNumber: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']); // ✅ Redirect to home
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithMicrosoft() {
    //this.authService.loginWithMicrosoft();
  }

  loginWithApple() {
    //this.authService.loginWithApple();
  }

  loginWithPhone() {
    //this.authService.loginWithPhone(this.phoneNumber);
  }
}
