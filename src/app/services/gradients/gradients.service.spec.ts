import { TestBed } from '@angular/core/testing';
import { GradientsService } from './gradients.service';
import { ColourConstants } from '../../classes/colour-constants';

describe('GradientsService', () => {
  let service: GradientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createLinearGradient', () => {
    it('should return an empty string when the provided colours are empty', () => {
      const result = service.createLinearGradient([]);

      expect(result).toBe('');
    });

    it('should return a valid gradient when only one colour is provided', () => {
      const result = service.createLinearGradient([ColourConstants.red().hsv]);

      expect(result).toBe(
        `linear-gradient(0deg, ${ColourConstants.red().hex}, ${ColourConstants.red().hex})`
      );
    });

    it('should return a valid gradient when two colours are provided', () => {
      const result = service.createLinearGradient([
        ColourConstants.red().hsv,
        ColourConstants.blue().hsv,
      ]);

      expect(result).toBe(
        `linear-gradient(0deg, ${ColourConstants.red().hex}, ${ColourConstants.blue().hex})`
      );
    });

    it('should default to 0deg when no rotation is provided', () => {
      const result = service.createLinearGradient([ColourConstants.red().hsv]);

      expect(result).toBe(
        `linear-gradient(0deg, ${ColourConstants.red().hex}, ${ColourConstants.red().hex})`
      );
    });

    it('should use the provided rotation when it exists', () => {
      const rotation = ColourConstants.hueMax / 2;

      const result = service.createLinearGradient(
        [ColourConstants.red().hsv],
        `${rotation}deg`
      );

      expect(result).toBe(
        `linear-gradient(${rotation}deg, ${ColourConstants.red().hex}, ${ColourConstants.red().hex})`
      );
    });
  });
});
