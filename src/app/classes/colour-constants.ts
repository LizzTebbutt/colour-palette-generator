import { hsvColour } from '../types/hsvColour';
import { rgbColour } from '../types/rgbColour';

export class ColourConstants {
  static readonly hueMax: number = 360;
  static readonly saturationMax: number = 100;
  static readonly valueMax: number = 100;
  static readonly rgbMax: number = 255;

  static readonly redLuminance = 0.2126;
  static readonly greenLuminance = 0.7152;
  static readonly blueLuminance = 0.0722;

  static red(): colour {
    return {
      hsv: { hue: 0, saturation: this.saturationMax, value: this.valueMax },
      rgb: { red: this.rgbMax, green: 0, blue: 0 },
      hex: '#ff0000',
      rgbCssCode: `rgb(${this.rgbMax}, 0, 0)`,
    };
  }
  static yellow(): colour {
    return {
      hsv: {
        hue: this.hueMax / 6,
        saturation: this.saturationMax,
        value: this.valueMax,
      },
      rgb: { red: this.rgbMax, green: this.rgbMax, blue: 0 },
      hex: '#ffff00',
      rgbCssCode: `rgb(${this.rgbMax}, ${this.rgbMax}, 0)`,
    };
  }
  static green(): colour {
    return {
      hsv: {
        hue: (this.hueMax / 6) * 2,
        saturation: this.saturationMax,
        value: this.valueMax,
      },
      rgb: { red: 0, green: this.rgbMax, blue: 0 },
      hex: '#00ff00',
      rgbCssCode: `rgb(0, ${this.rgbMax}, 0)`,
    };
  }
  static cyan(): colour {
    return {
      hsv: {
        hue: (this.hueMax / 6) * 3,
        saturation: this.saturationMax,
        value: this.valueMax,
      },
      rgb: { red: 0, green: this.rgbMax, blue: this.rgbMax },
      hex: '#00ffff',
      rgbCssCode: `rgb(0, ${this.rgbMax}, ${this.rgbMax})`,
    };
  }
  static blue(): colour {
    return {
      hsv: {
        hue: (this.hueMax / 6) * 4,
        saturation: this.saturationMax,
        value: this.valueMax,
      },
      rgb: { red: 0, green: 0, blue: this.rgbMax },
      hex: '#0000ff',
      rgbCssCode: `rgb(0, 0, ${this.rgbMax})`,
    };
  }
  static magenta(): colour {
    return {
      hsv: {
        hue: (this.hueMax / 6) * 5,
        saturation: this.saturationMax,
        value: this.valueMax,
      },
      rgb: { red: this.rgbMax, green: 0, blue: this.rgbMax },
      hex: '#ff00ff',
      rgbCssCode: `rgb(${this.rgbMax}, 0, ${this.rgbMax})`,
    };
  }
  static black(): colour {
    return {
      hsv: { hue: 0, saturation: 0, value: 0 },
      rgb: { red: 0, green: 0, blue: 0 },
      hex: '#000000',
      rgbCssCode: `rgb(0, 0, 0)`,
    };
  }
  static white(): colour {
    return {
      hsv: { hue: 0, saturation: 0, value: this.valueMax },
      rgb: { red: this.rgbMax, green: this.rgbMax, blue: this.rgbMax },
      hex: '#ffffff',
      rgbCssCode: `rgb(${this.rgbMax}, ${this.rgbMax}, ${this.rgbMax})`,
    };
  }
}

export interface colour {
  hsv: hsvColour;
  rgb: rgbColour;
  hex: string;
  rgbCssCode: string;
}
