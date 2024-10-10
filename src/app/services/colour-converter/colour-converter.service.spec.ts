import { TestBed } from '@angular/core/testing';

import { ColourConverterService } from './colour-converter.service';
import { ColourConstants } from '../../classes/colour-constants';
import { ColourMathsService } from '../colour-maths/colour-maths.service';

describe('ColourConverterService', () => {
  let service: ColourConverterService;
  let mockColourMathsService = jasmine.createSpyObj('ColourMathsService', [
    'hsvColourIsOutOfBounds',
    'correctHsvColour',
    'rgbColourIsOutOfBounds',
    'correctRgbColour',
  ]);

  beforeEach(() => {
    mockColourMathsService = jasmine.createSpyObj('ColourMathsService', [
      'hsvColourIsOutOfBounds',
      'correctHsvColour',
      'rgbColourIsOutOfBounds',
      'correctRgbColour',
    ]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ColourMathsService,
          useValue: mockColourMathsService,
        },
      ],
    });

    mockColourMathsService.correctHsvColour.and.returnValue(
      ColourConstants.red().hsv
    );
    mockColourMathsService.correctRgbColour.and.returnValue(
      ColourConstants.red().rgb
    );

    service = TestBed.inject(ColourConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hsvToRgb', () => {
    it('should check whether provided colour is out of bounds', () => {
      const colour = ColourConstants.red().hsv;

      service.hsvToRgb(colour);

      expect(
        mockColourMathsService.hsvColourIsOutOfBounds
      ).toHaveBeenCalledWith(colour);
    });

    it('should call correctHsvColour if provided colour is out of bounds', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(true);

      const outOfBoundsColour = {
        hue: ColourConstants.hueMax + 1,
        saturation: 0,
        value: 0,
      };
      service.hsvToRgb(outOfBoundsColour);
      expect(mockColourMathsService.correctHsvColour).toHaveBeenCalledWith(
        outOfBoundsColour
      );
    });

    it('should not call correctHsvColour if provided colour is not out of bounds', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(false);

      service.hsvToRgb(ColourConstants.red().hsv);
      expect(mockColourMathsService.correctHsvColour).toHaveBeenCalledTimes(0);
    });

    it('should convert an hsvColour in segment 1 correctly', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(false);

      const result = service.hsvToRgb(ColourConstants.red().hsv);
      expect(result).toEqual(ColourConstants.red().rgb);
    });

    it('should convert an hsvColour in segment 2 correctly', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(false);

      const result = service.hsvToRgb(ColourConstants.yellow().hsv);
      expect(result).toEqual(ColourConstants.yellow().rgb);
    });

    it('should convert an hsvColour in segment 3 correctly', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(false);

      const result = service.hsvToRgb(ColourConstants.green().hsv);
      expect(result).toEqual(ColourConstants.green().rgb);
    });

    it('should convert an hsvColour in segment 4 correctly', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(false);

      const result = service.hsvToRgb(ColourConstants.cyan().hsv);
      expect(result).toEqual(ColourConstants.cyan().rgb);
    });

    it('should convert an hsvColour in segment 5 correctly', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(false);

      const result = service.hsvToRgb(ColourConstants.blue().hsv);
      expect(result).toEqual(ColourConstants.blue().rgb);
    });

    it('should convert an hsvColour in segment 6 correctly', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(false);

      const result = service.hsvToRgb(ColourConstants.magenta().hsv);
      expect(result).toEqual(ColourConstants.magenta().rgb);
    });

    it('should convert black correctly', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(false);

      const result = service.hsvToRgb(ColourConstants.black().hsv);
      expect(result).toEqual(ColourConstants.black().rgb);
    });

    it('should convert white correctly', () => {
      mockColourMathsService.hsvColourIsOutOfBounds.and.returnValue(false);

      const result = service.hsvToRgb(ColourConstants.white().hsv);
      expect(result).toEqual(ColourConstants.white().rgb);
    });
  });

  describe('rgbToHex', () => {
    it('should check whether provided colour is out of bounds', () => {
      service.rgbToHex(ColourConstants.red().rgb);

      expect(mockColourMathsService.rgbColourIsOutOfBounds).toHaveBeenCalled();
    });

    it('should call correctRgbColour if provided colour is out of bounds', () => {
      mockColourMathsService.rgbColourIsOutOfBounds.and.returnValue(true);

      const outOfBoundsColour = {
        red: ColourConstants.rgbMax + 1,
        green: 0,
        blue: 0,
      };
      service.rgbToHex(outOfBoundsColour);
      expect(mockColourMathsService.correctRgbColour).toHaveBeenCalled();
    });

    it('should not call correctRgbColour if provided colour is not out of bounds', () => {
      mockColourMathsService.rgbColourIsOutOfBounds.and.returnValue(false);

      service.rgbToHex(ColourConstants.red().rgb);
      expect(mockColourMathsService.correctRgbColour).toHaveBeenCalledTimes(0);
    });

    it('should convert an rgbColour to a hex code string', () => {
      mockColourMathsService.rgbColourIsOutOfBounds.and.returnValue(false);

      let result = service.rgbToHex(ColourConstants.red().rgb);
      expect(result).toBe(ColourConstants.red().hex);

      result = service.rgbToHex(ColourConstants.green().rgb);
      expect(result).toBe(ColourConstants.green().hex);

      result = service.rgbToHex(ColourConstants.blue().rgb);
      expect(result).toBe(ColourConstants.blue().hex);

      result = service.rgbToHex(ColourConstants.black().rgb);
      expect(result).toBe(ColourConstants.black().hex);

      result = service.rgbToHex(ColourConstants.white().rgb);
      expect(result).toBe(ColourConstants.white().hex);
    });
  });

  describe('hsvToHex', () => {
    it('should convert an hsvColour to a hex code string', () => {
      let result = service.hsvToHex(ColourConstants.red().hsv);
      expect(result).toBe(ColourConstants.red().hex);

      result = service.hsvToHex(ColourConstants.green().hsv);
      expect(result).toBe(ColourConstants.green().hex);

      result = service.hsvToHex(ColourConstants.blue().hsv);
      expect(result).toBe(ColourConstants.blue().hex);

      result = service.hsvToHex(ColourConstants.black().hsv);
      expect(result).toBe(ColourConstants.black().hex);

      result = service.hsvToHex(ColourConstants.white().hsv);
      expect(result).toBe(ColourConstants.white().hex);
    });

    it('should call hsvToRgb and rgbToHex', () => {
      const hsvToRgbSpy = spyOn(service, 'hsvToRgb').and.callThrough();
      const rgbToHexSpy = spyOn(service, 'rgbToHex').and.callThrough();

      const result = service.hsvToHex(ColourConstants.red().hsv);

      expect(hsvToRgbSpy).toHaveBeenCalled();
      expect(rgbToHexSpy).toHaveBeenCalled();
      expect(result).toBe(ColourConstants.red().hex);
    });
  });
});
