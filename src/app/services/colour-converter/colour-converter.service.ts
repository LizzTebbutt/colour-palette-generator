import { Injectable } from '@angular/core';
import { hsvColour } from '../../types/hsvColour';
import { rgbColour } from '../../types/rgbColour';
import { ColourConstants } from '../../classes/colour-constants';
import { ColourMathsService } from '../colour-maths/colour-maths.service';

@Injectable({
  providedIn: 'root',
})
export class ColourConverterService {
  colourMathsService: ColourMathsService;

  constructor(colourMathsService: ColourMathsService) {
    this.colourMathsService = colourMathsService;
  }

  hsvToRgb(hsvColour: hsvColour): rgbColour {
    if (this.colourMathsService.hsvColourIsOutOfBounds(hsvColour)) {
      hsvColour = this.colourMathsService.correctHsvColour(hsvColour);
    }

    const saturation = hsvColour.saturation / ColourConstants.saturationMax;
    const value = hsvColour.value / ColourConstants.valueMax;

    const chroma = value * saturation;

    const hue = (hsvColour.hue % ColourConstants.hueMax) / 60;
    const secondary = chroma * (1 - Math.abs((hue % 2) - 1));

    const segment = Math.floor(hue);

    const rgbColour = {} as rgbColour;

    this.setColourValuesBySegment(segment, rgbColour, chroma, secondary);

    this.addValueModifier(value, chroma, rgbColour);
    this.scaleRgbColour(rgbColour);

    return rgbColour;
  }

  rgbToHex(colour: rgbColour): string {
    if (this.colourMathsService.rgbColourIsOutOfBounds(colour)) {
      colour = this.colourMathsService.correctRgbColour(colour);
    }

    return (
      '#' +
      this.componentToHex(colour.red) +
      this.componentToHex(colour.green) +
      this.componentToHex(colour.blue)
    );
  }

  hsvToHex(colour: hsvColour): string {
    const rgbColour = this.hsvToRgb(colour);
    return this.rgbToHex(rgbColour);
  }

  private componentToHex(component: number): string {
    component = Math.round(component);
    const hex = component.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  private setColourValuesBySegment(
    segment: number,
    rgbColour: rgbColour,
    chroma: number,
    secondary: number
  ) {
    switch (segment) {
      case 0:
        rgbColour.red = chroma;
        rgbColour.green = secondary;
        rgbColour.blue = 0;
        break;
      case 1:
        rgbColour.red = secondary;
        rgbColour.green = chroma;
        rgbColour.blue = 0;
        break;
      case 2:
        rgbColour.red = 0;
        rgbColour.green = chroma;
        rgbColour.blue = secondary;
        break;
      case 3:
        rgbColour.red = 0;
        rgbColour.green = secondary;
        rgbColour.blue = chroma;
        break;
      case 4:
        rgbColour.red = secondary;
        rgbColour.green = 0;
        rgbColour.blue = chroma;
        break;
      case 5:
        rgbColour.red = chroma;
        rgbColour.green = 0;
        rgbColour.blue = secondary;
        break;
    }
  }

  private addValueModifier(
    value: number,
    chroma: number,
    rgbColour: rgbColour
  ) {
    const valueModifier = value - chroma;

    rgbColour.red += valueModifier;
    rgbColour.green += valueModifier;
    rgbColour.blue += valueModifier;
  }

  private scaleRgbColour(rgbColour: rgbColour) {
    rgbColour.red *= ColourConstants.rgbMax;
    rgbColour.green *= ColourConstants.rgbMax;
    rgbColour.blue *= ColourConstants.rgbMax;
  }
}
