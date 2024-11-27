import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ColourConstants } from './classes/colour-constants';
import { AnchorColour } from './classes/anchor-colour/anchor-colour';
import { FormattingConstants } from './classes/formatting-constants';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const anchor: AnchorColour = new AnchorColour(
      ColourConstants.red().hsv,
      []
    );
    component.colourPalette = [anchor];

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'colourtron' title`, () => {
    expect(component.title).toEqual('colourtron');
  });

  describe('updateBackgroundGradient', () => {
    it('should set the --scheme-gradient variable in css to a gradient of the palette colours', () => {
      const redGradient = `linear-gradient(160deg, ${ColourConstants.red().hex}, ${ColourConstants.red().hex})`;
      const blueGradient = `linear-gradient(160deg, ${ColourConstants.blue().hex}, ${ColourConstants.blue().hex})`;

      let backgroundGradient =
        document.documentElement.style.getPropertyValue(`--scheme-gradient`);

      expect(backgroundGradient).toBe(redGradient);

      component.colourPalette = [
        new AnchorColour(ColourConstants.blue().hsv, []),
      ];

      component.updateBackgroundGradient();

      backgroundGradient =
        document.documentElement.style.getPropertyValue(`--scheme-gradient`);

      expect(backgroundGradient).toBe(blueGradient);
    });
  });

  describe('getWheelSpace', () => {
    it('should ignore the width of the sidebar, palette, and divider when calculating the space available for a mobile device', () => {
      component.windowInnerWidth = FormattingConstants.mobileMaxWidth;
      component.bodyWidth = FormattingConstants.mobileMaxWidth - 1;

      setComponentDomWidths();

      const expectedWheelSpace = component.bodyWidth - 4;
      const actualWheelSpace = component.getWheelSpace();

      expect(actualWheelSpace).toBe(expectedWheelSpace);
    });

    it('should ignore the width of the sidebar when calculating the space available for a tablet device', () => {
      component.windowInnerWidth = FormattingConstants.tabletMaxWidth;
      component.bodyWidth = FormattingConstants.tabletMaxWidth - 1;

      setComponentDomWidths();

      const expectedWheelSpace = component.bodyWidth - 7;
      const actualWheelSpace = component.getWheelSpace();

      expect(actualWheelSpace).toBe(expectedWheelSpace);
    });

    it('should include the width of the sidebar, palette, and divider when calculating the space available for a desktop device', () => {
      component.windowInnerWidth = FormattingConstants.tabletMaxWidth + 1;
      component.bodyClientWidth = FormattingConstants.tabletMaxWidth;

      setComponentDomWidths();

      const expectedWheelSpace = component.bodyClientWidth - 10;
      const actualWheelSpace = component.getWheelSpace();

      expect(actualWheelSpace).toBe(expectedWheelSpace);
    });
  });

  function setComponentDomWidths() {
    component.bodyBorder = 1;
    component.sidebarWidth = 1;
    component.sidebarWhiteSpace = 1;
    component.toggleButtonWidth = 1;
    component.contentContainerWhitespace = 1;
    component.contentWhitespace = 1;
    component.wheelContainerWhitespace = 1;
    component.swatchWidth = 1;
    component.swatchWhitespace = 1;
    component.dividerWhiteSpace = 1;
    component.swatchContainerWhitespace = 1;
  }
});
