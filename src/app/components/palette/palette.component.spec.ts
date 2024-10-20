import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaletteComponent } from './palette.component';
import { ColourMathsService } from '../../services/colour-maths/colour-maths.service';
import { ColourConstants } from '../../classes/colour-constants';
import { AnchorColour } from '../../classes/anchor-colour/anchor-colour';

describe('PaletteComponent', () => {
  let component: PaletteComponent;
  let fixture: ComponentFixture<PaletteComponent>;

  const mockColourMathsService = jasmine.createSpyObj('ColourMathsService', [
    'getOffsetHue',
    'getRelativeLuminance',
    'clamp',
    'hsvColourIsOutOfBounds',
    'rgbColourIsOutOfBounds',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteComponent],
      providers: [
        {
          provide: ColourMathsService,
          useValue: mockColourMathsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaletteComponent);
    component = fixture.componentInstance;

    component.colourPalette = [new AnchorColour(ColourConstants.red().hsv, [])];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('OnResize', () => {
    it('should be called on init', () => {
      expect(false);
    });

    it('should set the diameter to 200 when the screen size is less than 525', () => {
      expect(false);
    });

    it('should set the diameter to 300 when the screen size is less than 768', () => {
      expect(false);
    });

    it('should set the diameter to 400 when the screen size is larger than 768', () => {
      expect(false);
    });
  });
});
