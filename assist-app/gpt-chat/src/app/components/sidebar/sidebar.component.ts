import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    imports: [CommonModule, FormsModule]
})
export class SidebarComponent {
  isCollapsed = false;
  chatHistory = ['Chat 1', 'Chat 2', 'Chat 3']; // Example data
}
