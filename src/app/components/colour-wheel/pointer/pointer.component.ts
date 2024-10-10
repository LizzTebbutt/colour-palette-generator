import { Component, Input } from '@angular/core';
import { hsvColour } from '../../../types/hsvColour';
import { ColourConstants } from '../../../classes/colour-constants';
import { ColourMathsService } from '../../../services/colour-maths/colour-maths.service';
import { FormattingConstants } from '../../../classes/formatting-constants';

@Component({
  selector: 'app-pointer',
  standalone: true,
  imports: [],
  templateUrl: './pointer.component.html',
  styleUrl: './pointer.component.scss',
})
export class PointerComponent {
  @Input({ required: true }) colour!: hsvColour;

  @Input({
    transform: (value: number) =>
      value < 0 ? FormattingConstants.defaultWheelDiameter : value,
  })
  wheelDiameter = FormattingConstants.defaultWheelDiameter;

  @Input({
    transform: (value: number) =>
      value < 0 ? FormattingConstants.defaultPointerDiameter : value,
  })
  pointerSize: number = FormattingConstants.defaultPointerDiameter;

  @Input({
    transform: (value: number) =>
      value < 0 ? FormattingConstants.defaultArmWidth : value,
  })
  armWidth: number = FormattingConstants.defaultArmWidth;

  colourMathsService: ColourMathsService;

  constructor(colourMathsService: ColourMathsService) {
    this.colourMathsService = colourMathsService;
  }

  getPointerTransformation(): string {
    const pointerTranslation = this.calculatePointerTranslation();

    return `rotate(${this.colour.hue}deg) translateY(${-pointerTranslation}px)`;
  }
  getArmTransformation() {
    const armTranslation = this.calculateArmTranslation();
    const armScale = armTranslation * 2;

    return `rotate(${this.colour.hue}deg) translateY(${-armTranslation}px) scaleY(${armScale})`;
  }

  calculatePointerTranslation(): number {
    const radius = this.wheelDiameter / 2;
    const percentageFromTheCentre =
      this.colour.saturation / ColourConstants.saturationMax;
    const translatePx = radius * percentageFromTheCentre;

    return this.colourMathsService.clamp(translatePx, 0, Math.abs(radius));
  }
  calculateArmTranslation(): number {
    return this.calculatePointerTranslation() / 2;
  }

  calculatePointerMargins(): number {
    const pointerMargins = (this.wheelDiameter - this.pointerSize) / 2;

    return Math.max(pointerMargins, 0);
  }
  calculateArmMargins(): number {
    const armMargins = (this.wheelDiameter - this.armWidth) / 2;

    return Math.max(armMargins, 0);
  }
}
