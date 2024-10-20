import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  isExpanded = true;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  expandSidebar() {
    this.isExpanded = true;
  }

  collapseSidebar() {
    this.isExpanded = false;
  }
}
