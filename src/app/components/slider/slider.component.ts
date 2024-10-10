import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { GradientsService } from '../../services/gradients/gradients.service';
import { hsvColour } from '../../types/hsvColour';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [MatSliderModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {
  gradientsService: GradientsService;

  @Input({ required: true }) sliderName!: string;
  @Input() min = 0;
  @Input({ required: true }) max!: number;
  @Input() step = 1;

  @Input() backgroundColourFrom?: hsvColour;
  @Input() backgroundColourTo?: hsvColour;

  @Input() backgroundOffset = 0;

  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();

  constructor(gradientsService: GradientsService) {
    this.gradientsService = gradientsService;
  }

  sliderValueChange(event: Event) {
    const element = event.target as HTMLInputElement;

    this.value = +element.value;
    this.valueChange.emit(this.value);
  }

  getGradient(): string {
    if (this.backgroundColourFrom && this.backgroundColourTo) {
      return this.gradientsService.createLinearGradient(
        [this.backgroundColourFrom, this.backgroundColourTo],
        '0.25turn'
      );
    }
    return '';
  }
}
