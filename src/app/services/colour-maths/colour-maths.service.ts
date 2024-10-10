import { Injectable } from '@angular/core';
import { rgbColour } from '../../types/rgbColour';
import { hsvColour } from '../../types/hsvColour';
import { ColourConstants } from '../../classes/colour-constants';

@Injectable({
  providedIn: 'root',
})
export class ColourMathsService {
  getRelativeLuminance(colour: rgbColour): number {
    if (this.rgbColourIsOutOfBounds(colour)) {
      colour = this.correctRgbColour(colour);
    }

    return (
      ColourConstants.redLuminance * colour.red +
      ColourConstants.greenLuminance * colour.green +
      ColourConstants.blueLuminance * colour.blue
    );
  }

  clamp(target: number, min: number, max: number): number {
    if (min > max) {
      throw new RangeError();
    }

    return Math.min(Math.max(target, min), max);
  }

  static GetOffsetHue(hue: number, offset: number): number {
    return (hue + offset) % ColourConstants.hueMax;
  }

  getOffsetHue(hue: number, offset: number): number {
    return ColourMathsService.GetOffsetHue(hue, offset);
  }

  calculateHueByCoordinates(x: number, y: number): number {
    const theta = Math.atan(y / x);

    let radiansClockwiseFromY = 0;

    const xIsPositive = x >= 0;
    const yIsPositive = y >= 0;

    if (xIsPositive && yIsPositive) {
      radiansClockwiseFromY = Math.PI * 0.5 - theta;
    } else if (!xIsPositive && yIsPositive) {
      radiansClockwiseFromY = Math.PI * 1.5 - theta;
    } else if (!xIsPositive && !yIsPositive) {
      radiansClockwiseFromY = Math.PI * 1.5 - theta;
    } else if (xIsPositive && !yIsPositive) {
      radiansClockwiseFromY = Math.PI * 0.5 - theta;
    }

    return (radiansClockwiseFromY * 180) / Math.PI;
  }

  calculateSaturationByCoordinates(
    x: number,
    y: number,
    diameter: number
  ): number {
    const r = Math.sqrt(x * x + y * y);
    const radius = diameter / 2;

    return this.clamp(
      (r / radius) * ColourConstants.saturationMax,
      0,
      ColourConstants.saturationMax
    );
  }

  hsvColourIsOutOfBounds(colour: hsvColour) {
    return (
      colour.hue < 0 ||
      colour.hue > ColourConstants.hueMax ||
      colour.saturation < 0 ||
      colour.saturation > ColourConstants.saturationMax ||
      colour.value < 0 ||
      colour.value > ColourConstants.valueMax
    );
  }

  rgbColourIsOutOfBounds(colour: rgbColour) {
    return (
      colour.red < 0 ||
      colour.red > ColourConstants.rgbMax ||
      colour.green < 0 ||
      colour.green > ColourConstants.rgbMax ||
      colour.blue < 0 ||
      colour.blue > ColourConstants.rgbMax
    );
  }

  correctRgbColour(colour: rgbColour): rgbColour {
    colour.red = this.clamp(colour.red, 0, ColourConstants.rgbMax);
    colour.green = this.clamp(colour.green, 0, ColourConstants.rgbMax);
    colour.blue = this.clamp(colour.blue, 0, ColourConstants.rgbMax);

    return colour;
  }

  correctHsvColour(colour: hsvColour): hsvColour {
    if (colour.hue < 0) {
      const positiveHue = -colour.hue;
      colour.hue = 360 - (positiveHue % ColourConstants.hueMax);
    } else {
      colour.hue = colour.hue % ColourConstants.hueMax;
    }

    colour.saturation = this.clamp(
      colour.saturation,
      0,
      ColourConstants.saturationMax
    );
    colour.value = this.clamp(colour.value, 0, ColourConstants.valueMax);

    return colour;
  }
}
