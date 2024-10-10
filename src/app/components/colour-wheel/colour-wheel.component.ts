import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PointerComponent } from './pointer/pointer.component';
import { AnchorColour } from '../../classes/anchor-colour/anchor-colour';
import { ColourConstants } from '../../classes/colour-constants';
import { ColourMathsService } from '../../services/colour-maths/colour-maths.service';
import { FormattingConstants } from '../../classes/formatting-constants';

@Component({
  selector: 'app-colour-wheel',
  standalone: true,
  imports: [PointerComponent],
  templateUrl: './colour-wheel.component.html',
  styleUrl: './colour-wheel.component.scss',
})
export class ColourWheelComponent {
  @Input({ required: true }) selectedColour!: number;
  @Input({ required: true }) colourPalette!: AnchorColour[];
  @Output() colourPaletteChange = new EventEmitter<AnchorColour[]>();
  @Input({
    transform: (value: number) =>
      value < 0 ? FormattingConstants.defaultWheelDiameter : value,
  })
  diameter: number = FormattingConstants.defaultWheelDiameter;
  colourMathsService: ColourMathsService;

  constructor(colourMathsService: ColourMathsService) {
    this.colourMathsService = colourMathsService;
  }

  calculateValueOverlayOpacity(): number {
    const selectedColour = this.colourPalette[this.selectedColour].colour;

    const opacity = 1 - selectedColour.value / ColourConstants.valueMax;

    return this.colourMathsService.clamp(opacity, 0, 1);
  }

  colourWheelClick(event: MouseEvent) {
    const div = event.target as HTMLDivElement;
    const colourWheel = div.closest(
      '.colour-wheel-container'
    ) as HTMLDivElement;

    const { x, y } = this.getClickCoordinates(
      colourWheel,
      event.clientX,
      event.clientY
    );

    this.updateColourByCoordinates(x, y);

    this.colourPaletteChange.emit(this.colourPalette);
  }

  private getClickCoordinates(
    div: HTMLDivElement,
    clientX: number,
    clientY: number
  ) {
    const rect = div.getBoundingClientRect();

    const x = clientX - (rect.left + rect.right) / 2;
    const y = clientY - (rect.top + rect.bottom) / 2;
    return { x, y };
  }

  private updateColourByCoordinates(x: number, y: number) {
    this.colourPalette[this.selectedColour].colour.saturation =
      this.colourMathsService.calculateSaturationByCoordinates(
        x,
        y,
        this.diameter
      );
    this.colourPalette[this.selectedColour].colour.hue =
      this.colourMathsService.calculateHueByCoordinates(x, y * -1);
  }
}
