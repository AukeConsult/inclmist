import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ✅ Import AuthService
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [CommonModule, FormsModule]
})
export class HeaderComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();
  user: User | null = null; // ✅ Store user info

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.restoreSidebarState();
    this.loadUser();
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  loadUser() {
    this.user = this.authService.getLoggedInUser();
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
}
