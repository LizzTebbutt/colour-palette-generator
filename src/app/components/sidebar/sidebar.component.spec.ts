import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  let sidebarService: SidebarService;

  beforeEach(async () => {
    sidebarService = new SidebarService();

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [{ provide: SidebarService, useValue: sidebarService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isExpanded', () => {
    it('should get the value from the sidebarService', () => {
      sidebarService.isExpanded = false;

      let result = component.isExpanded;

      expect(result).toBe(false);

      sidebarService.isExpanded = true;

      result = component.isExpanded;

      expect(result).toBe(true);
    });
  });
});
