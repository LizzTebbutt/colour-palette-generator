import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toggleSidebar', () => {
    it('should change isExpanded to false when it is true', () => {
      service.isExpanded = true;

      service.toggleSidebar();

      expect(service.isExpanded).toBe(false);
    });

    it('should change isExpanded to true when it is false', () => {
      service.isExpanded = false;

      service.toggleSidebar();

      expect(service.isExpanded).toBe(true);
    });
  });

  describe('expandSidebar', () => {
    it('should change isExpanded to true when it is true', () => {
      service.isExpanded = true;

      service.expandSidebar();

      expect(service.isExpanded).toBe(true);
    });

    it('should change isExpanded to true when it is false', () => {
      service.isExpanded = false;

      service.expandSidebar();

      expect(service.isExpanded).toBe(true);
    });
  });

  describe('collapseSidebar', () => {
    it('should change isExpanded to false when it is true', () => {
      service.isExpanded = true;

      service.collapseSidebar();

      expect(service.isExpanded).toBe(false);
    });

    it('should change isExpanded to false when it is false', () => {
      service.isExpanded = false;

      service.collapseSidebar();

      expect(service.isExpanded).toBe(false);
    });
  });
});
