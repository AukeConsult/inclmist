import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { AppUser } from 'shared-library/src';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userForm!: FormGroup;
  user: AppUser | null = null;
  loading = true;
  isEdit = false;  // Toggle for showing the edit form
  languages = ['English', 'Norwegian'];  // Example languages

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+\d{6,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: ['']
      }),
      jobTitle: [''],
      birthdate: [''],
      nationality: [''],
      socialMediaHandles: this.fb.group({
        facebook: [''],
        twitter: [''],
        linkedIn: ['']
      }),
      languagePreferences: this.buildLanguages(this.languages)
    });

    this.authService.getLoggedInUser().subscribe(async (user) => {
      this.user = user;
      this.loading = false;
      if (user) {
        const userDetails = await this.userService.getUserDetails(user.uid);
        this.userForm.patchValue(userDetails);
        this.user = userDetails;
      }
    });
  }

  buildLanguages(languages: string[]): FormArray {
    return this.fb.array(languages.map(language => this.fb.control(false)));
  }

  get languagePreferences(): FormArray {
    return this.userForm.get('languagePreferences') as FormArray;
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
  }

  async onSubmit() {
    if (this.userForm.valid && this.user) {
      try {
        const formValue = { ...this.userForm.value };
        formValue.languagePreferences = formValue.languagePreferences
          .map((checked: boolean, index: number) => checked ? this.languages[index] : null)
          .filter(Boolean);

        await this.userService.updateUserInfo(this.user.uid, formValue);
        alert('Profile updated successfully!');
        this.toggleEdit();  // Hide the form after successful update
      } catch (error: any) {
        alert(error.message);
      }
    }
  }
}
