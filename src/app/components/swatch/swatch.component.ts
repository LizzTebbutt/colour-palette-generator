import { Component, Input } from '@angular/core';
import { hsvColour } from '../../types/hsvColour';
import { SliderComponent } from '../slider/slider.component';
import { ColourMathsService } from '../../services/colour-maths/colour-maths.service';
import { ColourConverterService } from '../../services/colour-converter/colour-converter.service';

@Component({
  selector: 'app-swatch',
  standalone: true,
  imports: [SliderComponent],
  templateUrl: './swatch.component.html',
  styleUrl: './swatch.component.scss',
})
export class SwatchComponent {
  @Input() width = 200;
  @Input({ required: true }) colour!: hsvColour;
  colourMathsService: ColourMathsService;
  colourConverterService: ColourConverterService;
  textColour = 'white';

  constructor(
    colourMathsService: ColourMathsService,
    colourConverterService: ColourConverterService
  ) {
    this.colourMathsService = colourMathsService;
    this.colourConverterService = colourConverterService;
  }

  getTextColour() {
    const rgb = this.colourConverterService.hsvToRgb(this.colour);
    const luminance = this.colourMathsService.getRelativeLuminance(rgb);
    this.textColour = luminance > 125 ? 'black' : 'white';

    return this.textColour;
  }

  getRgbColourString(colour: hsvColour): string {
    const rgb = this.colourConverterService.hsvToRgb(colour);

    return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
  }

  getSelectedColourHex(colour: hsvColour) {
    const rgb = this.colourConverterService.hsvToRgb(colour);

    return this.colourConverterService.rgbToHex(rgb);
  }
}
