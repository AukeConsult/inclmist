import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Assist gpt';
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;

    // Add or remove class for layout changes
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      if (this.isSidebarCollapsed) {
        mainContainer.classList.add('sidebar-collapsed');
      } else {
        mainContainer.classList.remove('sidebar-collapsed');
      }
    }
  }
}
