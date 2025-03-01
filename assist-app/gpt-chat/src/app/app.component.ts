import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Assist gpt';
  isSidebarCollapsed = false; // Track sidebar state

  constructor() {
    this.restoreSidebarState();
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
}
