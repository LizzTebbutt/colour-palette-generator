import { TestBed } from '@angular/core/testing';
import { ColourMathsService } from './colour-maths.service';
import { ColourConstants } from '../../classes/colour-constants';

describe('ColourMathsService', () => {
  let service: ColourMathsService;

  const small = 0;
  const medium = 50;
  const large = 100;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColourMathsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRelativeLuminance', () => {
    it('should check that the colour is in bounds', () => {
      const spy = spyOn(service, 'rgbColourIsOutOfBounds');
      const colour = ColourConstants.black().rgb;

      service.getRelativeLuminance(colour);

      expect(spy).toHaveBeenCalledWith(colour);
    });

    it('should call correctRgbColour if colour is out of bounds', () => {
      const spy = spyOn(service, 'correctRgbColour').and.returnValue(
        ColourConstants.red().rgb
      );
      const colour = { red: ColourConstants.rgbMax + 1, blue: 0, green: 0 };

      service.getRelativeLuminance(colour);

      expect(spy).toHaveBeenCalledWith(colour);
    });

    it('should not call correctRgbColour if colour is not out of bounds', () => {
      const spy = spyOn(service, 'correctRgbColour');
      const colour = ColourConstants.red().rgb;

      service.getRelativeLuminance(colour);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('luminance should be 0 when the colour is black', () => {
      const result = service.getRelativeLuminance(ColourConstants.black().rgb);

      expect(result).toBe(0);
    });

    it('luminance should be 255 when the colour is white', () => {
      const result = service.getRelativeLuminance(ColourConstants.white().rgb);

      const roundedResult = Math.round(result); // round because the relative luminance decimals don't quite add up

      expect(roundedResult).toBe(ColourConstants.rgbMax);
    });

    it('should return the expected luminance for red when the colour is red', () => {
      const result = service.getRelativeLuminance(ColourConstants.red().rgb);

      const expectedLuminance =
        ColourConstants.redLuminance * ColourConstants.rgbMax;

      expect(result).toBe(expectedLuminance);
    });

    it('should return the expected luminance for green when the colour is green', () => {
      const result = service.getRelativeLuminance(ColourConstants.green().rgb);

      const expectedLuminance =
        ColourConstants.greenLuminance * ColourConstants.rgbMax;

      expect(result).toBe(expectedLuminance);
    });

    it('should return the expected luminance for blue when the colour is blue', () => {
      const result = service.getRelativeLuminance(ColourConstants.blue().rgb);

      const expectedLuminance =
        ColourConstants.blueLuminance * ColourConstants.rgbMax;

      expect(result).toBe(expectedLuminance);
    });
  });

  describe('clamp', () => {
    it('should throw an error if max is less than min', () => {
      expect(() => service.clamp(medium, large, small)).toThrowError(
        RangeError
      );
    });

    it('should return the target when it is between the minimum and maximum', () => {
      const result = service.clamp(medium, small, large);

      expect(result).toBe(medium);
    });

    it('should return the maximum when the target is larger', () => {
      const result = service.clamp(large, small, medium);

      expect(result).toBe(medium);
    });

    it('should return the minimum when the target is smaller', () => {
      const result = service.clamp(small, medium, large);

      expect(result).toBe(medium);
    });

    it('should handle negative numbers', () => {
      const result = service.clamp(-medium, -large, large);

      expect(result).toBe(-medium);
    });
  });

  describe('getOffsetHue', () => {
    it('should add together the hue and offset', () => {
      const offset = ColourConstants.hueMax / 2;

      const result = service.getOffsetHue(
        ColourConstants.red().hsv.hue,
        offset
      );

      expect(result).toBe(offset);
    });

    it('should take the modulo of the result when the hue exceeds the maximum', () => {
      const offset = ColourConstants.hueMax;

      const result = service.getOffsetHue(
        ColourConstants.blue().hsv.hue,
        offset
      );

      expect(result).toBe(ColourConstants.blue().hsv.hue);
    });

    it('should handle negative results', () => {
      const offset = -ColourConstants.hueMax;

      const result = service.getOffsetHue(
        ColourConstants.red().hsv.hue,
        offset
      );

      expect(result).toBe(ColourConstants.red().hsv.hue);
    });
  });

  describe('calculateHueByCoordinates', () => {
    it('should work when x is 0 and y is positive', () => {
      const result = service.calculateHueByCoordinates(0, 1);

      expect(result).toBe(0);
    });

    it('should work when x is positive and y is positive', () => {
      const result = service.calculateHueByCoordinates(1, 1);

      expect(result).toBe(ColourConstants.hueMax / 8);
    });

    it('should work when x is positive and y is 0', () => {
      const result = service.calculateHueByCoordinates(1, 0);

      expect(result).toBe((ColourConstants.hueMax / 8) * 2);
    });

    it('should work when x is positive and y is negative', () => {
      const result = service.calculateHueByCoordinates(1, -1);

      expect(result).toBe((ColourConstants.hueMax / 8) * 3);
    });

    it('should work when x is 0 and y is negative', () => {
      const result = service.calculateHueByCoordinates(0, -1);

      expect(result).toBe((ColourConstants.hueMax / 8) * 4);
    });

    it('should work when x is negative and y is negative', () => {
      const result = service.calculateHueByCoordinates(-1, -1);

      expect(result).toBe((ColourConstants.hueMax / 8) * 5);
    });

    it('should work when x is negative and y is 0', () => {
      const result = service.calculateHueByCoordinates(-1, 0);

      expect(result).toBe((ColourConstants.hueMax / 8) * 6);
    });

    it('should work when x is negative and y is positive', () => {
      const result = service.calculateHueByCoordinates(-1, 1);

      expect(result).toBe((ColourConstants.hueMax / 8) * 7);
    });
  });

  describe('calculateSaturationByCoordinates', () => {
    it('should calculate when the saturation is 0', () => {
      const diameter = 2;

      const result = service.calculateSaturationByCoordinates(0, 0, diameter);

      expect(result).toBe(0);
    });

    it('should calculate when the saturation is max', () => {
      const diameter = 2;
      const radius = diameter / 2;

      const result = service.calculateSaturationByCoordinates(
        radius,
        0,
        diameter
      );

      expect(result).toBe(ColourConstants.saturationMax);
    });

    it('should clamp when saturation exceeds max', () => {
      const diameter = 2;

      const result = service.calculateSaturationByCoordinates(
        diameter,
        0,
        diameter
      );

      expect(result).toBe(ColourConstants.saturationMax);
    });
  });

  describe('hsvColourIsOutOfBounds', () => {
    it('should return true when the hue exceeds the maximum', () => {
      const invalidColour = {
        hue: ColourConstants.hueMax + 1,
        saturation: 0,
        value: 0,
      };
      expect(service.hsvColourIsOutOfBounds(invalidColour)).toBe(true);
    });

    it('should return true when the hue is negative', () => {
      const invalidColour = {
        hue: -1,
        saturation: 0,
        value: 0,
      };
      expect(service.hsvColourIsOutOfBounds(invalidColour)).toBe(true);
    });

    it('should return true when the saturation exceeds the maximum', () => {
      const invalidColour = {
        hue: 0,
        saturation: ColourConstants.saturationMax + 1,
        value: 0,
      };
      expect(service.hsvColourIsOutOfBounds(invalidColour)).toBe(true);
    });

    it('should return true when the saturation is negative', () => {
      const invalidColour = {
        hue: 0,
        saturation: -1,
        value: 0,
      };
      expect(service.hsvColourIsOutOfBounds(invalidColour)).toBe(true);
    });

    it('should return true when the value exceeds the maximum', () => {
      const invalidColour = {
        hue: 0,
        saturation: 0,
        value: ColourConstants.valueMax + 1,
      };
      expect(service.hsvColourIsOutOfBounds(invalidColour)).toBe(true);
    });

    it('should return true when the value is negative', () => {
      const invalidColour = {
        hue: 0,
        saturation: 0,
        value: -1,
      };
      expect(service.hsvColourIsOutOfBounds(invalidColour)).toBe(true);
    });

    it('should return false when hsv is valid', () => {
      let validColour = ColourConstants.red().hsv;
      expect(service.hsvColourIsOutOfBounds(validColour)).toBe(false);

      validColour = ColourConstants.green().hsv;
      expect(service.hsvColourIsOutOfBounds(validColour)).toBe(false);

      validColour = ColourConstants.blue().hsv;
      expect(service.hsvColourIsOutOfBounds(validColour)).toBe(false);

      validColour = ColourConstants.black().hsv;
      expect(service.hsvColourIsOutOfBounds(validColour)).toBe(false);

      validColour = ColourConstants.white().hsv;
      expect(service.hsvColourIsOutOfBounds(validColour)).toBe(false);
    });
  });

  describe('rgbColourIsOutOfBounds', () => {
    it('should return true when rgb is invalid', () => {
      let invalidColour = {
        red: ColourConstants.rgbMax + 1,
        green: 0,
        blue: 0,
      };
      expect(service.rgbColourIsOutOfBounds(invalidColour)).toBe(true);

      invalidColour = { red: 0, green: ColourConstants.rgbMax + 1, blue: 0 };
      expect(service.rgbColourIsOutOfBounds(invalidColour)).toBe(true);

      invalidColour = { red: 0, green: 0, blue: ColourConstants.rgbMax + 1 };
      expect(service.rgbColourIsOutOfBounds(invalidColour)).toBe(true);

      invalidColour = { red: -1, green: 0, blue: 0 };
      expect(service.rgbColourIsOutOfBounds(invalidColour)).toBe(true);

      invalidColour = { red: 0, green: -1, blue: 0 };
      expect(service.rgbColourIsOutOfBounds(invalidColour)).toBe(true);

      invalidColour = { red: 0, green: 0, blue: -1 };
      expect(service.rgbColourIsOutOfBounds(invalidColour)).toBe(true);
    });

    it('should return false when rgb is valid', () => {
      let validColour = ColourConstants.red().rgb;
      expect(service.rgbColourIsOutOfBounds(validColour)).toBe(false);

      validColour = ColourConstants.green().rgb;
      expect(service.rgbColourIsOutOfBounds(validColour)).toBe(false);

      validColour = ColourConstants.blue().rgb;
      expect(service.rgbColourIsOutOfBounds(validColour)).toBe(false);

      validColour = ColourConstants.black().rgb;
      expect(service.rgbColourIsOutOfBounds(validColour)).toBe(false);

      validColour = ColourConstants.white().rgb;
      expect(service.rgbColourIsOutOfBounds(validColour)).toBe(false);
    });
  });

  describe('correctRgbColour', () => {
    it('Should correct the red component if it is out of bounds', () => {
      const colour = ColourConstants.red().rgb;
      colour.red += 1;

      let result = service.correctRgbColour(colour);
      expect(result.red).toBe(ColourConstants.rgbMax);

      colour.red = -1;
      result = service.correctRgbColour(colour);
      expect(result.red).toBe(0);
    });

    it('Should correct the green component if it is out of bounds', () => {
      const colour = ColourConstants.green().rgb;
      colour.green += 1;

      let result = service.correctRgbColour(colour);
      expect(result.green).toBe(ColourConstants.rgbMax);

      colour.green = -1;
      result = service.correctRgbColour(colour);
      expect(result.green).toBe(0);
    });

    it('Should correct the blue component if it is out of bounds', () => {
      const colour = ColourConstants.blue().rgb;
      colour.blue += 1;

      let result = service.correctRgbColour(colour);
      expect(result.blue).toBe(ColourConstants.rgbMax);

      colour.blue = -1;
      result = service.correctRgbColour(colour);
      expect(result.blue).toBe(0);
    });
  });

  describe('correctHsvColour', () => {
    it('Should correct the hue component if it is out of bounds', () => {
      const colour = ColourConstants.black().hsv;
      colour.hue = ColourConstants.hueMax;

      let result = service.correctHsvColour(colour);
      expect(result.hue).toBe(0);

      colour.hue = -1;
      result = service.correctHsvColour(colour);
      expect(result.hue).toBe(359);
    });

    it('Should correct the saturation component if it is out of bounds', () => {
      const colour = ColourConstants.black().hsv;
      colour.saturation = ColourConstants.saturationMax + 1;

      let result = service.correctHsvColour(colour);
      expect(result.saturation).toBe(ColourConstants.saturationMax);

      colour.saturation = -1;
      result = service.correctHsvColour(colour);
      expect(result.saturation).toBe(0);
    });

    it('Should correct the value component if it is out of bounds', () => {
      const colour = ColourConstants.black().hsv;
      colour.value = ColourConstants.valueMax + 1;

      let result = service.correctHsvColour(colour);
      expect(result.value).toBe(ColourConstants.valueMax);

      colour.value = -1;
      result = service.correctHsvColour(colour);
      expect(result.value).toBe(0);
    });
  });
});
