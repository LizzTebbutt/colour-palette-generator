import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
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
import { FormattingConstants } from './classes/formatting-constants';

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
export class AppComponent implements OnInit, OnDestroy {
  title = 'colourtron';

  colourPalette: AnchorColour[] = [
    new AnchorColour(ColourConstants.red().hsv, []),
  ];
  selectedColour = 0;
  wheelDiameter = FormattingConstants.defaultWheelDiameter;
  observer: ResizeObserver = new ResizeObserver(this.setNewDiameter);
  zone: NgZone;
  contentContainer!: HTMLDivElement;

  colourMathsService: ColourMathsService;
  colourConverterService: ColourConverterService;
  gradientsService: GradientsService;

  constructor(
    colourMathsService: ColourMathsService,
    colourConverterService: ColourConverterService,
    gradientsService: GradientsService,
    zone: NgZone
  ) {
    this.colourMathsService = colourMathsService;
    this.colourConverterService = colourConverterService;
    this.gradientsService = gradientsService;
    this.zone = zone;
  }

  ngOnInit() {
    this.generateBackgroundGradient();

    this.contentContainer = document.getElementsByClassName(
      'content-container'
    )[0] as HTMLDivElement;

    this.observer = new ResizeObserver(() => {
      this.zone.run(() => {
        this.setNewDiameter();
      });
    });

    this.observer.observe(this.contentContainer);
  }

  ngOnDestroy() {
    this.observer.unobserve(this.contentContainer);
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

  private setNewDiameter() {
    const containerWidth = this.getDivWidthByClass('wheel-container');

    const availableWidth = this.getAvailableWidth();
    const sidebarWidth = this.getSidebarWidth();

    if (window.innerWidth < 768) {
      this.wheelDiameter = containerWidth;
    } else if (window.innerWidth < 1024) {
      this.wheelDiameter = Math.min(
        availableWidth,
        FormattingConstants.defaultWheelDiameter
      );
    } else {
      const wheelWidth = availableWidth - sidebarWidth;

      this.wheelDiameter = Math.min(
        wheelWidth,
        FormattingConstants.defaultWheelDiameter
      );
    }
  }

  private getDivWidthByClass(className: string): number {
    const element = document.getElementsByClassName(
      className
    )[0] as HTMLDivElement;

    return element.offsetWidth;
  }

  private getSidebarWidth() {
    const sidebarWidth = this.getDivWidthByClass('sidebar-body-container');
    const sidebarButtonWidth = this.getDivWidthByClass('toggle-button');
    const borderWidth = 5;
    const fullSidebarWidth = sidebarWidth + sidebarButtonWidth + borderWidth;
    return fullSidebarWidth;
  }

  private getAvailableWidth() {
    const body = document.body as HTMLDivElement;

    const contentWidth = this.getDivWidthByClass('content');
    const wheelContainerWidth = this.getDivWidthByClass('wheel-container');
    const usedContentWidth = contentWidth - wheelContainerWidth;
    const contentContainerPadding = 32;

    const availableWidth =
      body.clientWidth - usedContentWidth - contentContainerPadding;

    return availableWidth;
  }
}
