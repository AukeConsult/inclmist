import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { AppUser } from 'shared-library';
import {CommonModule} from '@angular/common';
//import {OutsideClickDirective} from '../../../directives/outside-click.directive';

@Component({
  standalone:true,
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class UserInfoComponent implements OnInit {
  userForm!: FormGroup;
  user: AppUser | null = null;
  loading = true;
  fields: any[];  // This includes all fields
  mainFields: any[];  // Specific to non-address and non-social media
  addressFields: any[];  // Specific to address
  socialFields: any[];  // Specific to social media handles
  availableLanguages: string[] = [
    'English',
    'Norwegian',
    'French',
    'Spanish',
    'German'
  ];
  languageDropdownOpen: boolean = false;
  editMode: boolean = false;



  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService) {
    this.initializeFields();
  }

  ngOnInit() {
    this.authService.getLoggedInUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.userService.getUserDetails(user.uid).then(userDetails => {
          this.initializeForm(userDetails);
          this.user = userDetails;
          this.loading = false;
        });
      }
    });
  }

  toggleGlobalEditMode(): void {
    this.editMode = !this.editMode;

    // If we leave edit mode, reset all field edits
    if (!this.editMode) {
      [...this.mainFields, ...this.addressFields, ...this.socialFields].forEach(field => field.editing = false);
    }
  }

  toggleLanguageDropdown(): void {
    this.languageDropdownOpen = !this.languageDropdownOpen;
  }

  isLanguageSelected(language: string): boolean {
    const selectedLanguages = this.userForm.get('languagePreferences').value || [];
    return selectedLanguages.includes(language);
  }

  onLanguageToggle(language: string, event: Event): void {
    const selectedLanguages = this.userForm.get('languagePreferences').value || [];
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      if (!selectedLanguages.includes(language)) {
        selectedLanguages.push(language);
      }
    } else {
      const index = selectedLanguages.indexOf(language);
      if (index >= 0) {
        selectedLanguages.splice(index, 1);
      }
    }

    this.userForm.get('languagePreferences').setValue(selectedLanguages);
  }

  initializeFields() {
    // Define all fields
    this.fields = [
      { key: 'displayName', label: 'Name', icon: 'fas fa-user', editing: false, type: 'text' },
      { key: 'phoneNumber', label: 'Phone Number', icon: 'fas fa-phone', editing: false, type: 'tel' },
      { key: 'email', label: 'Email', icon: 'fas fa-envelope', editing: false, type: 'email' },
      { key: 'password', label: 'Password', icon: 'fas fa-lock', editing: false, type: 'password' },
      { key: 'jobTitle', label: 'Job Title', icon: 'fas fa-briefcase', editing: false, type: 'text' },
      { key: 'birthdate', label: 'Birthdate', icon: 'fas fa-birthday-cake', editing: false, type: 'date' },
      { key: 'nationality', label: 'Nationality', icon: 'fas fa-globe-europe', editing: false, type: 'text' },
      { key: 'languagePreferences', label: 'Languages', icon: 'fas fa-language', editing: false, type: 'select', multiple: true }
    ];
    this.addressFields = [
      { key: 'street', label: 'Street', icon: 'fas fa-road', editing: false, type: 'text' },
      { key: 'city', label: 'City', icon: 'fas fa-city', editing: false, type: 'text' },
      { key: 'state', label: 'State', icon: 'fas fa-map-marker-alt', editing: false, type: 'text' },
      { key: 'postalCode', label: 'Postal Code', icon: 'fas fa-mail-bulk', editing: false, type: 'text' },
      { key: 'country', label: 'Country', icon: 'fas fa-flag', editing: false, type: 'text' }
    ];
    this.socialFields = [
      { key: 'facebook', label: 'Facebook', icon: 'fab fa-facebook', editing: false, type: 'url' },
      { key: 'twitter', label: 'Twitter', icon: 'fab fa-twitter', editing: false, type: 'text' },
      { key: 'linkedIn', label: 'LinkedIn', icon: 'fab fa-linkedin', editing: false, type: 'url' }
    ];

    this.mainFields = this.fields.filter(f => !this.addressFields.concat(this.socialFields).some(af => af.key === f.key));
  }

  initializeForm(userData: AppUser) {
    languagePreferences: [userData.languagePreferences || []]
      this.userForm = this.fb.group({
      displayName: [userData.displayName || '', [Validators.required, Validators.minLength(3)]],
      phoneNumber: [userData.phoneNumber || '', [Validators.required, Validators.pattern(/^\+\d{6,15}$/)]],
      email: [userData.email || '', [Validators.required, Validators.email]],
      password: [''],  // Passwords are usually not retrieved for security
      jobTitle: [userData.jobTitle || ''],
      birthdate: [userData.birthdate || '', Validators.required],
      nationality: [userData.nationality || ''],
      languagePreferences: [userData.languagePreferences || []],
      address: this.fb.group({
        street: [userData.address?.street || ''],
        city: [userData.address?.city || ''],
        state: [userData.address?.state || ''],
        postalCode: [userData.address?.postalCode || ''],
        country: [userData.address?.country || '']
      }),
      socialMediaHandles: this.fb.group({
        facebook: [userData.socialMediaHandles?.facebook || ''],
        twitter: [userData.socialMediaHandles?.twitter || ''],
        linkedIn: [userData.socialMediaHandles?.linkedIn || '']
      })
    });
  }

  toggleEditing(field: any): void {
    field.editing = !field.editing;
    if (field.editing) {
      const value = this.user[field.key];
      if (field.key === 'languagePreferences') {
        this.userForm.get(field.key).setValue(value || []);
      } else {
        this.userForm.get(field.key).setValue(value);
      }
    }
  }

  onSubmit() {
    if (this.userForm.valid && this.user) {
      this.userService.updateUserInfo(this.user.uid, this.userForm.value)
        .then(() => {
          alert('Profile updated successfully!');
          this.fields.forEach(field => field.editing = false); // Reset editing states
          this.addressFields.forEach(field => field.editing = false); // Reset editing states
          this.socialFields.forEach(field => field.editing = false); // Reset editing states

          this.initializeForm(this.userForm.value); // Reinitialize to reflect saved data
        })
        .catch(error => alert('Error updating profile: ' + error.message));
    }
  }



}
