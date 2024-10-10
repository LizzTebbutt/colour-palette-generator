import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ColourConstants } from './classes/colour-constants';
import { AnchorColour } from './classes/anchor-colour/anchor-colour';
import { ColourMathsService } from './services/colour-maths/colour-maths.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockColourMathsService = jasmine.createSpyObj('ColourMathsService', [
    'getOffsetHue',
    'getRelativeLuminance',
    'clamp',
    'hsvColourIsOutOfBounds',
    'rgbColourIsOutOfBounds',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: ColourMathsService,
          useValue: mockColourMathsService,
        },
      ],
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

  it(`should have the 'colour-picker' title`, () => {
    expect(component.title).toEqual('colour-picker');
  });

  describe('addComplementary', () => {
    it('should add a related colour to the selected anchor', () => {
      expect(component.colourPalette[0].relatedColours.length).toBe(0);

      component.addComplementary();

      expect(component.colourPalette[0].relatedColours.length).toBe(1);

      component.addComplementary();

      expect(component.colourPalette[0].relatedColours.length).toBe(2);
    });

    it('should set the offset of the related colour to 180', () => {
      component.addComplementary();

      expect(component.colourPalette[0].relatedColours[0].hueOffset).toBe(180);
    });
  });

  describe('getOffsetHue', () => {
    it('should call out to the ColourMathsService for the calculation', () => {
      mockColourMathsService.getOffsetHue.and.returnValue(1);

      const result = component.getOffsetHue(ColourConstants.red().hsv, 1);

      expect(result).toBe(1);
    });
  });
});
