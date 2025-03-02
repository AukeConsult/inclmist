import { Component } from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {FooterComponent} from './components/footer/footer.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RouterOutlet,
    CommonModule,
    FormsModule
  ]
})
export class AppComponent {
  title = 'Assist gpt';
  isSidebarCollapsed = false; // Track sidebar state

  constructor(private router: Router) {
    this.restoreSidebarState();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navigated to:', event.url);
      }
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('sidebarState', this.isSidebarCollapsed ? 'closed' : 'open');
  }

  restoreSidebarState() {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState === 'closed') {
      this.isSidebarCollapsed = true;
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register'; // ✅ Hide on login & register pages
  }

}
