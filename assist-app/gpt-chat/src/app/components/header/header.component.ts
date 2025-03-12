import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();
  user!: Observable<User | null>; // ✅ Observable<User | null>
  private userSubscription!: Subscription; // To manage subscription

  constructor(private router: Router, private authService: AuthService,private ngZone: NgZone) {}

  ngOnInit() {
    this.restoreSidebarState();
    this.user = this.authService.getLoggedInUser(); // ✅ Assign the observable
    this.ngZone.runOutsideAngular(() => {
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active');
      localStorage.setItem('sidebarState', sidebar.classList.contains('active') ? 'open' : 'closed');
    }
    // Optionally, if using EventEmitter to notify another component
    this.sidebarToggle.emit();
  }


  restoreSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebar) {
      // Apply 'active' class based on localStorage, not just add it unconditionally
      if (sidebarState === 'open') {
        sidebar.classList.add('active');
      } else {
        sidebar.classList.remove('active');
      }
    }
  }


  logout() {
    this.authService.logout();
  }
  goToHome() {
    this.router.navigate(['/home']);
  }
  goToUserProfile() {
    this.router.navigate(['/user-details']);
  }
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe(); // ✅ Prevent memory leaks
    }
  }
}
