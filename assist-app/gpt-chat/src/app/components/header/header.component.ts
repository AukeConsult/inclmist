import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();

  ngOnInit() {
    this.restoreSidebarState(); // Restore sidebar state when page loads
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    this.sidebarToggle.emit(); // Notify parent component (app.component.ts)

    if (sidebar) {
      sidebar.classList.toggle('active');

      // Save sidebar state in localStorage
      if (sidebar.classList.contains('active')) {
        localStorage.setItem('sidebarState', 'open');
      } else {
        localStorage.setItem('sidebarState', 'closed');
      }
    }
  }

  restoreSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const sidebarState = localStorage.getItem('sidebarState');

    if (sidebar && sidebarState === 'open') {
      sidebar.classList.add('active');
    }
  }
}
