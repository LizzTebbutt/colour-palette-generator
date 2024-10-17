import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  isExpanded = true;

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }

  expandSidenav() {
    this.isExpanded = true;
  }

  collapseSidenav() {
    this.isExpanded = false;
  }
}
