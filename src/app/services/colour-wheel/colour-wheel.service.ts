import { Injectable } from '@angular/core';
import { AnchorColour } from '../../classes/anchor-colour/anchor-colour';
import { RelativeColour } from '../../types/relativeColour';
import { ColourMathsService } from '../colour-maths/colour-maths.service';

@Injectable({
  providedIn: 'root',
})
export class ColourWheelService {
  isChanging = false;
  selectedAnchor?: AnchorColour;
  selectedRelativeColour?: RelativeColour;

  colourMathsService: ColourMathsService;

  constructor(colourMathsService: ColourMathsService) {
    this.colourMathsService = colourMathsService;
  }

  colourWheelMousedown(
    event: MouseEvent,
    anchor: AnchorColour,
    diameter: number
  ) {
    if (this.isChanging) {
      return;
    }

    this.isChanging = true;
    this.selectedAnchor = anchor;

    return this.updateAnchorColour(event, diameter);
  }

  anchorPointerMousedown(
    event: MouseEvent,
    anchor: AnchorColour,
    diameter: number
  ) {
    this.isChanging = true;
    this.selectedAnchor = anchor;

    return this.updateAnchorColour(event, diameter);
  }

  relativePointerMousedown(
    event: MouseEvent,
    anchor: AnchorColour,
    relativeColour: RelativeColour,
    diameter: number
  ) {
    this.isChanging = true;
    this.selectedAnchor = anchor;
    this.selectedRelativeColour = relativeColour;

    return this.updateRelativeColour(event, diameter);
  }

  updateColour(event: MouseEvent, diameter: number) {
    if (this.isChanging) {
      if (this.selectedRelativeColour) {
        this.updateRelativeColour(event, diameter);
      } else if (this.selectedAnchor) {
        this.updateAnchorColour(event, diameter);
      }
    }
  }

  stopUpdatingColour() {
    this.isChanging = false;
    this.selectedAnchor = undefined;
    this.selectedRelativeColour = undefined;
  }

  private updateAnchorColour(event: MouseEvent, diameter: number) {
    const { x, y } = this.getClickCoordinatesFromEvent(event);

    const hue = this.colourMathsService.calculateHueByCoordinates(x, -y);

    const saturation = this.colourMathsService.calculateSaturationByCoordinates(
      x,
      y,
      diameter
    );

    this.selectedAnchor!.colour.hue = hue;
    this.selectedAnchor!.colour.saturation = saturation;
  }

  private updateRelativeColour(event: MouseEvent, diameter: number) {
    const { x, y } = this.getClickCoordinatesFromEvent(event);

    const hue = this.colourMathsService.calculateHueByCoordinates(x, -y);

    const saturation = this.colourMathsService.calculateSaturationByCoordinates(
      x,
      y,
      diameter
    );

    const offsetHue = hue - this.selectedAnchor!.colour.hue;

    this.selectedRelativeColour!.hueOffset = offsetHue;
    this.selectedRelativeColour!.saturation = saturation;
  }

  private getClickCoordinatesFromEvent(event: MouseEvent) {
    const targetDiv = event.target as HTMLDivElement;

    if (targetDiv) {
      const colourWheel = targetDiv.closest(
        '.colour-wheel-container'
      ) as HTMLDivElement;

      const rect = colourWheel.getBoundingClientRect();

      const x = event.clientX - (rect.left + rect.right) / 2;
      const y = event.clientY - (rect.top + rect.bottom) / 2;

      return { x, y };
    }

    const x = 0;
    const y = 0;

    return { x, y };
  }
}
