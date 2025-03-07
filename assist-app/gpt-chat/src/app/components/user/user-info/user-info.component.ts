import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule, // Required for Angular directives
    ReactiveFormsModule // ✅ Ensure Reactive Forms are recognized
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  userForm!: FormGroup;
  user: User | null = null;
  loading = true;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+\d{6,15}$/)]], // ✅ Fixed validation
      email: ['', [Validators.required, Validators.email]],
      password: [''] // Password is optional
    });

    this.authService.getLoggedInUser().subscribe(async (user) => {
      this.user = user;
      this.loading = false;

      if (user) {
        const phoneNumber = await this.authService.getUserPhoneNumber(user.uid);
        console.log('Fetched user:', user); // Debugging log

        this.userForm.patchValue({
          displayName: user.displayName || '',
          phoneNumber: phoneNumber || '', // ✅ Ensure phone number gets loaded
          email: user.email || '',
        });
      }
    });
  }

  async onSubmit() {
    if (this.userForm.valid && this.user) {
      try {
        await this.authService.updateUserInfo(
          this.userForm.value.displayName,
          this.userForm.value.phoneNumber,
          this.userForm.value.email,
          this.userForm.value.password
        );
        alert('Profile updated successfully!');
      } catch (error: any) {
        alert(error.message);
      }
    }
  }
}
