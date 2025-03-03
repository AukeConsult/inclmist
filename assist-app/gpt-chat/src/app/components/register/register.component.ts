import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ Import Router

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {} // ✅ Inject Router

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      console.log("Registration successful");
      this.router.navigate(['/login']); // ✅ Redirect to login after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }
}
