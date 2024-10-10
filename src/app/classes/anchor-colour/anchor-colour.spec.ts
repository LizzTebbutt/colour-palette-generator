import { ColourConstants } from '../colour-constants';
import { AnchorColour } from './anchor-colour';

describe('AnchorColour', () => {
  let anchorColour: AnchorColour;

  beforeEach(() => {
    anchorColour = new AnchorColour(ColourConstants.red().hsv, []);
  });

  it('should create', () => {
    expect(anchorColour).toBeTruthy();
  });

  describe('addComplementary', () => {
    it('should add a complementary colour when relatedColours is empty', () => {
      anchorColour.addComplementaryColour();

      expect(anchorColour.relatedColours.length).toBe(1);
      expect(anchorColour.relatedColours[0].hueOffset).toBe(
        ColourConstants.hueMax / 2
      );
    });

    it('should add a complementary colour when relatedColours is not empty', () => {
      anchorColour.addComplementaryColour();
      anchorColour.addComplementaryColour();

      expect(anchorColour.relatedColours.length).toBe(2);
      expect(anchorColour.relatedColours[0].hueOffset).toBe(
        ColourConstants.hueMax / 2
      );
      expect(anchorColour.relatedColours[1].hueOffset).toBe(
        ColourConstants.hueMax / 2
      );
    });
  });

  describe('getColourAndRelatives', () => {
    it('should return only the anchor colour when relatedColours is empty', () => {
      const expectedResult = [anchorColour.colour];

      const result = anchorColour.getColourAndRelatives();

      expect(result).toEqual(expectedResult);
    });

    it('should the anchor colour and related colours when relatedColours is not empty', () => {
      anchorColour.addComplementaryColour();
      const expectedResult = [anchorColour.colour, ColourConstants.cyan().hsv];

      const result = anchorColour.getColourAndRelatives();

      expect(result).toEqual(expectedResult);
    });
  });
});
