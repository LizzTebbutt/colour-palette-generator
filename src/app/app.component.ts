import {
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { FooterComponent } from './components/footer/footer.component';

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
    FooterComponent,
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
  sidebarContainer!: HTMLDivElement;
  body!: HTMLDivElement;

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
    this.sidebarContainer = document.getElementsByClassName(
      'sidebar-body-container'
    )[0] as HTMLDivElement;

    this.observer = new ResizeObserver(() => {
      this.zone.run(() => {
        this.setNewDiameter();
      });
    });

    this.observer.observe(this.sidebarContainer);

    this.updateBackgroundGradient();
  }

  ngOnDestroy() {
    this.observer.unobserve(this.sidebarContainer);
  }

  @HostListener('window:resize')
  onResize() {
    this.setNewDiameter();
  }

  updateBackgroundGradient() {
    const colours: hsvColour[] = [];

    this.colourPalette.forEach(anchor => {
      colours.push(...anchor.getColourAndRelatives());
    });

    const gradient = this.gradientsService.createLinearGradient(
      colours,
      '160deg'
    );

    document.documentElement.style.setProperty(`--scheme-gradient`, gradient);
  }

  private setNewDiameter() {
    this.wheelDiameter = this.colourMathsService.clamp(
      this.getWheelSpace(),
      0,
      FormattingConstants.defaultWheelDiameter
    );
  }

  private getDivByClass(className: string): HTMLDivElement {
    const element = document.getElementsByClassName(
      className
    )[0] as HTMLDivElement;

    return element;
  }

  private getWheelSpace() {
    const body = document.body as HTMLDivElement;
    const bodyStyle = window.getComputedStyle(body);
    const bodyWidth = body.offsetWidth;
    const bodyBorder =
      +bodyStyle.borderLeftWidth.replace('px', '') +
      +bodyStyle.borderRightWidth.replace('px', '');

    const sidebar = this.getDivByClass('sidebar-body-container');
    const sidebarWidth = sidebar.clientWidth;
    const sidebarWhiteSpace = this.getSumOfMarginBorderPadding(sidebar);

    const toggleButton = this.getDivByClass('toggle-button');
    const toggleButtonWidth = toggleButton.clientWidth;

    const contentContainer = this.getDivByClass('content-container');
    const contentContainerWhitespace =
      this.getSumOfMarginBorderPadding(contentContainer);

    const content = this.getDivByClass('content');
    const contentWhitespace = this.getSumOfMarginBorderPadding(content);

    const wheelContainer = this.getDivByClass('wheel-container');
    const wheelContainerWhitespace =
      this.getSumOfMarginBorderPadding(wheelContainer);

    const divider = this.getDivByClass('divider');
    const dividerWhiteSpace = this.getSumOfMarginBorderPadding(divider);

    const swatchContainer = this.getDivByClass('swatch-container');
    const swatchContainerWhitespace =
      this.getSumOfMarginBorderPadding(swatchContainer);

    const swatch = this.getDivByClass('swatch');
    const swatchWidth = swatch.clientWidth;
    const swatchWhitespace = this.getSumOfMarginBorderPadding(swatch);

    if (window.innerWidth < 768) {
      const remainingWidth =
        bodyWidth -
        bodyBorder -
        contentContainerWhitespace -
        contentWhitespace -
        wheelContainerWhitespace;

      return remainingWidth;
    } else if (window.innerWidth < 1024) {
      const remainingWidth =
        bodyWidth -
        contentContainerWhitespace -
        contentWhitespace -
        wheelContainerWhitespace -
        dividerWhiteSpace -
        swatchContainerWhitespace -
        swatchWidth -
        swatchWhitespace;

      return remainingWidth;
    } else {
      const remainingWidth =
        body.clientWidth -
        sidebarWidth -
        sidebarWhiteSpace -
        toggleButtonWidth -
        contentContainerWhitespace -
        contentWhitespace -
        wheelContainerWhitespace -
        dividerWhiteSpace -
        swatchContainerWhitespace -
        swatchWidth -
        swatchWhitespace;

      return remainingWidth;
    }
  }

  private getSumOfMarginBorderPadding(element: HTMLDivElement): number {
    const elementStyle = window.getComputedStyle(element);

    const marginLeft = +elementStyle.marginLeft.replace('px', '');
    const marginRight = +elementStyle.marginRight.replace('px', '');
    const borderLeft = +elementStyle.borderLeftWidth.replace('px', '');
    const borderRight = +elementStyle.borderRightWidth.replace('px', '');
    const paddingLeft = +elementStyle.paddingLeft.replace('px', '');
    const paddingRight = +elementStyle.paddingRight.replace('px', '');

    return (
      marginLeft +
      marginRight +
      borderLeft +
      borderRight +
      paddingLeft +
      paddingRight
    );
  }
}
