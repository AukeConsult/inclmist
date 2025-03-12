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
      // Any Bootstrap-specific JavaScript initialization
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    this.sidebarToggle.emit();

    if (sidebar) {
      sidebar.classList.toggle('active');
      localStorage.setItem('sidebarState', sidebar.classList.contains('active') ? 'open' : 'closed');
    }
  }

  restoreSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebar && sidebarState === 'open') {
      sidebar.classList.add('active');
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
