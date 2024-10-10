import { Component, EventEmitter, Input, Output } from '@angular/core';
import { hsvColour } from '../../../../types/hsvColour';
import { SliderComponent } from '../../../slider/slider.component';
import { ColourConverterService } from '../../../../services/colour-converter/colour-converter.service';
import { ColourConstants } from '../../../../classes/colour-constants';

@Component({
  selector: 'app-hsv-sliders',
  standalone: true,
  imports: [SliderComponent],
  templateUrl: './hsv-sliders.component.html',
  styleUrl: './hsv-sliders.component.scss',
})
export class HsvSlidersComponent {
  @Input({ required: true }) colour!: hsvColour;
  @Output() colourChange = new EventEmitter<hsvColour>();

  textColour = 'white';
  colourConverterService: ColourConverterService;

  readonly hueMax = ColourConstants.hueMax;
  readonly valueMax = ColourConstants.valueMax;
  readonly saturationMax = ColourConstants.saturationMax;

  constructor(colourConverterService: ColourConverterService) {
    this.colourConverterService = colourConverterService;
  }

  hueChanges(value: number) {
    this.colour.hue = value;
    this.colourChanges();
  }

  saturationChanges(value: number) {
    this.colour.saturation = value;
    this.colourChanges();
  }

  valueChanges(value: number) {
    this.colour.value = value;
    this.colourChanges();
  }

  private colourChanges() {
    this.colourChange.emit(this.colour);
  }

  getRgbColourString(colour: hsvColour): string {
    const rgb = this.colourConverterService.hsvToRgb(colour);

    return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
  }
}
