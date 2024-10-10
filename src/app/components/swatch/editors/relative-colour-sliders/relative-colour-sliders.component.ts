import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { SliderComponent } from '../../../slider/slider.component';
import { ColourConstants } from '../../../../classes/colour-constants';
import { relativeColour } from '../../../../types/selectedColour';
import { ColourConverterService } from '../../../../services/colour-converter/colour-converter.service';
import { ColourMathsService } from '../../../../services/colour-maths/colour-maths.service';

@Component({
  selector: 'app-relative-colour-sliders',
  standalone: true,
  imports: [SliderComponent],
  templateUrl: './relative-colour-sliders.component.html',
  styleUrl: './relative-colour-sliders.component.scss',
})
export class RelativeColourSlidersComponent {
  @Input({ required: true }) relativeColour!: relativeColour;
  @Output() relativeColourChange = new EventEmitter<relativeColour>();
  @Input() containerWidth = 0;

  @Input({ required: true }) anchorHue!: number;
  colourConverterService: ColourConverterService;
  colourMathsService: ColourMathsService;

  @ViewChild('relativeHueSlider') relativeHueSlider: SliderComponent =
    {} as SliderComponent;

  constructor(
    colourConverterService: ColourConverterService,
    colourMathsService: ColourMathsService
  ) {
    this.colourConverterService = colourConverterService;
    this.colourMathsService = colourMathsService;
  }

  readonly hueMax = ColourConstants.hueMax;
  readonly saturationMax = ColourConstants.saturationMax;
  readonly valueMax = ColourConstants.valueMax;

  relativeHueChange(value: number) {
    this.relativeColour.hueOffset = value;

    this.relativeColourChange.emit(this.relativeColour);
  }

  saturationChange(value: number) {
    this.relativeColour.saturation = value;

    this.relativeColourChange.emit(this.relativeColour);
  }

  valueChange(value: number) {
    this.relativeColour.value = value;

    this.relativeColourChange.emit(this.relativeColour);
  }

  getBackgroundOffset(): number {
    const percentageOffset =
      (ColourConstants.hueMax - this.anchorHue) / ColourConstants.hueMax;

    return (this.containerWidth - 20) * percentageOffset;
  }
}
