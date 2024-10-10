import { Injectable } from '@angular/core';
import { hsvColour } from '../../types/hsvColour';
import { ColourConverterService } from '../colour-converter/colour-converter.service';

@Injectable({
  providedIn: 'root',
})
export class GradientsService {
  colourConverterService: ColourConverterService;

  constructor(colourConverterService: ColourConverterService) {
    this.colourConverterService = colourConverterService;
  }

  createLinearGradient(colourStops: hsvColour[], rotation = '0deg'): string {
    if (!colourStops || colourStops.length == 0) {
      return '';
    }

    let gradientColours = '';

    colourStops.forEach(colour => {
      gradientColours += `${this.colourConverterService.hsvToHex(colour)}, `;
    });

    if (colourStops.length == 1) {
      gradientColours += `${this.colourConverterService.hsvToHex(colourStops[0])}, `;
    }

    gradientColours = gradientColours.slice(0, -2);

    return `linear-gradient(${rotation}, ${gradientColours})`;
  }
}
