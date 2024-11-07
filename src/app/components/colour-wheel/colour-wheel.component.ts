import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { PointerComponent } from './pointer/pointer.component';
import { AnchorColour } from '../../classes/anchor-colour/anchor-colour';
import { ColourConstants } from '../../classes/colour-constants';
import { ColourMathsService } from '../../services/colour-maths/colour-maths.service';
import { RelativeColour } from '../../types/relativeColour';
import { ColourWheelService } from '../../services/colour-wheel/colour-wheel.service';

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
  @Input({ required: true }) diameter!: number;
  colourMathsService: ColourMathsService;
  colourWheelService: ColourWheelService;

  constructor(
    colourMathsService: ColourMathsService,
    colourWheelService: ColourWheelService
  ) {
    this.colourMathsService = colourMathsService;
    this.colourWheelService = colourWheelService;
  }

  @HostListener('window:mousemove', ['$event'])
  updateColour(event: MouseEvent) {
    this.colourWheelService.updateColour(event, this.diameter);
  }

  @HostListener('window:mouseup')
  stopUpdatingColour() {
    this.colourWheelService.stopUpdatingColour();
  }

  colourWheelMousedown(event: MouseEvent) {
    this.colourWheelService.colourWheelMousedown(
      event,
      this.colourPalette[this.selectedColour],
      this.diameter
    );
  }

  pointerMousedown(event: MouseEvent, anchor: AnchorColour) {
    this.updateSelectedColour(anchor);

    this.colourWheelService.anchorPointerMousedown(
      event,
      anchor,
      this.diameter
    );
  }

  secondaryPointerMousedown(
    event: MouseEvent,
    anchor: AnchorColour,
    relativeColour: RelativeColour
  ) {
    this.updateSelectedColour(anchor);

    this.colourWheelService.relativePointerMousedown(
      event,
      anchor,
      relativeColour,
      this.diameter
    );
  }

  calculateValueOverlayOpacity(): number {
    const selectedColour = this.colourPalette[this.selectedColour].colour;

    const opacity = 1 - selectedColour.value / ColourConstants.valueMax;

    return this.colourMathsService.clamp(opacity, 0, 1);
  }

  private updateSelectedColour(anchor: AnchorColour) {
    this.selectedColour = this.colourPalette.findIndex(
      element => element === anchor
    );
  }
}
