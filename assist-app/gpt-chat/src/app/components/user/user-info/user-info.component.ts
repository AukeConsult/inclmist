import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import {UserService} from '../../../services/user.service';
import { AppUser } from 'shared-library/src';

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
  user: AppUser = null;
  loading = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+\d{6,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Optional
      address: [''], // Add this line if you have address in your model
    });

    this.authService.getLoggedInUser().subscribe(async (user) => {
      this.user = user;
      this.loading = false;

      if (user) {
        // Assume getUserDetails is a method that fetches the user details from Firestore
        const userDetails = await this.userService.getUserDetails(user.uid);
        this.userForm.patchValue({
          displayName: userDetails.displayName || '',
          phoneNumber: userDetails.phoneNumber || '',
          email: userDetails.email || '',
          address: userDetails.address || '', // Patch the address if available
        });
      }
    });
  }


  async onSubmit() {
    if (this.userForm.valid && this.user) {
      try {
        // Pass the whole form value which matches the AppUser model
        await this.userService.updateUserInfo(this.user.uid, this.userForm.value);
        alert('Profile updated successfully!');
      } catch (error: any) {
        alert(error.message);
      }
    }
  }


}
