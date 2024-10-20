import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ColourWheelComponent } from './components/colour-wheel/colour-wheel.component';
import { SliderComponent } from './components/slider/slider.component';
import { SwatchComponent } from './components/swatch/swatch.component';
import { AnchorColour } from './classes/anchor-colour/anchor-colour';
import { HsvSlidersComponent } from './components/swatch/editors/hsv-sliders/hsv-sliders.component';
import { RelativeColourSlidersComponent } from './components/swatch/editors/relative-colour-sliders/relative-colour-sliders.component';
import { ColourConstants } from './classes/colour-constants';
import { ColourMathsService } from './services/colour-maths/colour-maths.service';
import { hsvColour } from './types/hsvColour';
import { ColourConverterService } from './services/colour-converter/colour-converter.service';
import { GradientsService } from './services/gradients/gradients.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PaletteComponent } from './components/palette/palette.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ColourWheelComponent,
    SliderComponent,
    SwatchComponent,
    HsvSlidersComponent,
    RelativeColourSlidersComponent,
    SidebarComponent,
    PaletteComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'colour-picker';

  colourPalette: AnchorColour[] = [
    new AnchorColour(ColourConstants.red().hsv, []),
  ];
  selectedColour = 0;

  colourMathsService: ColourMathsService;
  colourConverterService: ColourConverterService;
  gradientsService: GradientsService;

  constructor(
    colourMathsService: ColourMathsService,
    colourConverterService: ColourConverterService,
    gradientsService: GradientsService
  ) {
    this.colourMathsService = colourMathsService;
    this.colourConverterService = colourConverterService;
    this.gradientsService = gradientsService;
  }

  ngOnInit() {
    this.generateBackgroundGradient();
  }

  generateBackgroundGradient(): string {
    const colours: hsvColour[] = [];

    this.colourPalette.forEach(anchor => {
      colours.push(...anchor.getColourAndRelatives());
    });

    colours.forEach(colour => {
      colour.saturation = colour.saturation / 2;
    });

    return this.gradientsService.createLinearGradient(colours, '160deg');
  }
}
