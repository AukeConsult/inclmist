import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    imports: [CommonModule, FormsModule]
})
export class SidebarComponent implements OnInit{
  isCollapsed = false;
  chatHistory = [];

  ngOnInit(): void {
    for (let i = 0; i < 50; i++) {
      this.chatHistory.push("chat " + i)
    }
  }
}
