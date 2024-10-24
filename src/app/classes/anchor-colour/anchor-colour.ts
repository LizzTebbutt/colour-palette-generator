import { hsvColour } from '../../types/hsvColour';
import { RelativeColour } from '../../types/relativeColour';
import { ColourConstants } from '../colour-constants';

export class AnchorColour {
  colour: hsvColour;
  relatedColours: RelativeColour[];

  constructor(colour: hsvColour, relatedColours: RelativeColour[]) {
    this.colour = colour;
    this.relatedColours = relatedColours;
  }

  addComplementaryColour(): void {
    this.relatedColours.push({
      hueOffset: ColourConstants.hueMax / 2,
      saturation: this.colour.saturation,
      value: this.colour.value,
    });
  }

  getColourAndRelatives(): hsvColour[] {
    const colours: hsvColour[] = [];

    colours.push({
      hue: this.colour.hue,
      saturation: this.colour.saturation,
      value: this.colour.value,
    });
    this.relatedColours.forEach(relatedColour => {
      const hue =
        (this.colour.hue + relatedColour.hueOffset) % ColourConstants.hueMax;

      const relatedColourHsv = {
        hue: hue,
        saturation: relatedColour.saturation,
        value: relatedColour.value,
      };
      colours.push(relatedColourHsv);
    });

    return colours;
  }
}
