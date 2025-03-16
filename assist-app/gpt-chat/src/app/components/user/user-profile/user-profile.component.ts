import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from '../user-info/user-info.component';
import {ListProfilesComponent} from '../../profile/profile/list-profiles/list-profiles.component'; // Adjust the path as necessary

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, UserInfoComponent, ListProfilesComponent], // Ensure UserInfoComponent is also standalone
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  // Component logic here
}
