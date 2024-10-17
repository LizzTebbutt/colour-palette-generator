import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnchorColour } from '../../classes/anchor-colour/anchor-colour';
import { ColourMathsService } from '../../services/colour-maths/colour-maths.service';
import { hsvColour } from '../../types/hsvColour';
import { ColourWheelComponent } from '../colour-wheel/colour-wheel.component';
import { SwatchComponent } from '../swatch/swatch.component';
import { RelativeColourSlidersComponent } from '../swatch/editors/relative-colour-sliders/relative-colour-sliders.component';
import { HsvSlidersComponent } from '../swatch/editors/hsv-sliders/hsv-sliders.component';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-palette',
  standalone: true,
  imports: [
    ColourWheelComponent,
    SwatchComponent,
    RelativeColourSlidersComponent,
    HsvSlidersComponent,
  ],
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.scss',
})
export class PaletteComponent implements OnInit {
  colourMathsService: ColourMathsService;
  @Input({ required: true }) colourPalette!: AnchorColour[];
  @Output() colourPaletteChange = new EventEmitter<AnchorColour[]>();

  diameter = 400;
  selectedColour = 0;

  constructor(colourMathsService: ColourMathsService) {
    this.colourMathsService = colourMathsService;
  }

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    console.log(window.innerWidth);

    if (window.innerWidth < 525) {
      this.diameter = 200;
    } else if (window.innerWidth < 768) {
      this.diameter = 300;
    } else {
      this.diameter = 400;
    }
  }

  addComplementary(): void {
    this.colourPalette[this.selectedColour].addComplementaryColour();
  }

  getOffsetHue(colour: hsvColour, offset: number): number {
    return this.colourMathsService.getOffsetHue(colour.hue, offset);
  }
}
