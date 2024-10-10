import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwatchComponent } from './swatch.component';
import { ColourConstants } from '../../classes/colour-constants';
import { ColourConverterService } from '../../services/colour-converter/colour-converter.service';
import { ColourMathsService } from '../../services/colour-maths/colour-maths.service';

describe('SwatchComponent', () => {
  let component: SwatchComponent;
  let fixture: ComponentFixture<SwatchComponent>;
  const mockColourMathsService = jasmine.createSpyObj('ColourMathsService', [
    'getRelativeLuminance',
  ]);
  const mockColourConverterService = jasmine.createSpyObj(
    'ColourConverterService',
    ['hsvToRgb', 'rgbToHex']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwatchComponent],
      providers: [
        {
          provide: ColourMathsService,
          useValue: mockColourMathsService,
        },
        {
          provide: ColourConverterService,
          useValue: mockColourConverterService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SwatchComponent);
    fixture.componentInstance.colour = ColourConstants.red().hsv;
    mockColourConverterService.hsvToRgb.and.returnValue(
      ColourConstants.red().rgb
    );
    mockColourConverterService.rgbToHex.and.returnValue(
      ColourConstants.red().hex
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTextColour', () => {
    it('should return black when the luminance is greater than 125', () => {
      component.colour = ColourConstants.white().hsv;

      mockColourConverterService.hsvToRgb.and.returnValue(
        ColourConstants.white().rgb
      );
      mockColourMathsService.getRelativeLuminance.and.returnValue(
        ColourConstants.rgbMax
      );

      let result = component.getTextColour();
      expect(result).toBe('black');

      mockColourMathsService.getRelativeLuminance.and.returnValue(126);
      result = component.getTextColour();
      expect(result).toBe('black');
    });

    it('should return white when the luminance is below 125', () => {
      component.colour = ColourConstants.black().hsv;

      mockColourConverterService.hsvToRgb.and.returnValue(
        ColourConstants.black().rgb
      );
      mockColourMathsService.getRelativeLuminance.and.returnValue(0);

      let result = component.getTextColour();
      expect(result).toBe('white');

      mockColourMathsService.getRelativeLuminance.and.returnValue(125);
      result = component.getTextColour();
      expect(result).toBe('white');
    });
  });

  describe('getRgbColourString', () => {
    it('should return an rgb colour', () => {
      const testRgbColour = ColourConstants.red().rgbCssCode;

      const actualRgbColour = component.getRgbColourString(component.colour);

      expect(actualRgbColour).toBe(testRgbColour);
    });
  });

  describe('getSelectedColourHex', () => {
    it('should return a hex code', () => {
      const testHexCode = ColourConstants.red().hex;

      const actualHexCode = component.getSelectedColourHex(component.colour);

      expect(actualHexCode).toBe(testHexCode);
    });
  });
});
