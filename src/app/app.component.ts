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

  //#region Window Resize Logic
  windowInnerWidth = 0;
  bodyWidth = 0;
  bodyClientWidth = 0;
  bodyBorder = 0;
  sidebarWidth = 0;
  sidebarWhiteSpace = 0;
  toggleButtonWidth = 0;
  contentContainerWhitespace = 0;
  contentWhitespace = 0;
  wheelContainerWhitespace = 0;
  swatchWidth = 0;
  swatchWhitespace = 0;
  dividerWhiteSpace = 0;
  swatchContainerWhitespace = 0;

  @HostListener('window:resize')
  onResize() {
    this.setNewDiameter();
  }

  private setNewDiameter() {
    this.setWidthsFromDom();

    this.wheelDiameter = this.colourMathsService.clamp(
      this.getWheelSpace(),
      0,
      FormattingConstants.defaultWheelDiameter
    );
  }

  getWheelSpace(): number {
    if (this.windowInnerWidth <= FormattingConstants.mobileMaxWidth) {
      const remainingWidth =
        this.bodyWidth -
        this.bodyBorder -
        this.contentContainerWhitespace -
        this.contentWhitespace -
        this.wheelContainerWhitespace;

      return remainingWidth;
    } else if (this.windowInnerWidth <= FormattingConstants.tabletMaxWidth) {
      const remainingWidth =
        this.bodyWidth -
        this.contentContainerWhitespace -
        this.contentWhitespace -
        this.wheelContainerWhitespace -
        this.dividerWhiteSpace -
        this.swatchContainerWhitespace -
        this.swatchWidth -
        this.swatchWhitespace;

      return remainingWidth;
    } else {
      const remainingWidth =
        this.bodyClientWidth -
        this.sidebarWidth -
        this.sidebarWhiteSpace -
        this.toggleButtonWidth -
        this.contentContainerWhitespace -
        this.contentWhitespace -
        this.wheelContainerWhitespace -
        this.dividerWhiteSpace -
        this.swatchContainerWhitespace -
        this.swatchWidth -
        this.swatchWhitespace;

      return remainingWidth;
    }
  }

  private setWidthsFromDom() {
    this.windowInnerWidth = window.innerWidth;

    const body = document.body as HTMLDivElement;
    const bodyStyle = window.getComputedStyle(body);
    this.bodyWidth = body.offsetWidth;
    this.bodyClientWidth = body.clientWidth;
    this.bodyBorder =
      +bodyStyle.borderLeftWidth.replace('px', '') +
      +bodyStyle.borderRightWidth.replace('px', '');

    const sidebar = this.getDivByClass('sidebar-body-container');
    this.sidebarWidth = sidebar.clientWidth;
    this.sidebarWhiteSpace = this.getSumOfMarginBorderPaddingByClassName(
      'sidebar-body-container'
    );

    const toggleButton = this.getDivByClass('toggle-button');
    this.toggleButtonWidth = toggleButton.clientWidth;

    this.contentContainerWhitespace =
      this.getSumOfMarginBorderPaddingByClassName('content-container');

    this.contentWhitespace =
      this.getSumOfMarginBorderPaddingByClassName('content');

    this.wheelContainerWhitespace =
      this.getSumOfMarginBorderPaddingByClassName('wheel-container');

    this.dividerWhiteSpace =
      this.getSumOfMarginBorderPaddingByClassName('divider');

    this.swatchContainerWhitespace =
      this.getSumOfMarginBorderPaddingByClassName('swatch-container');

    const swatch = this.getDivByClass('swatch');
    this.swatchWidth = swatch.clientWidth;
    this.swatchWhitespace =
      this.getSumOfMarginBorderPaddingByClassName('swatch');
  }

  private getSumOfMarginBorderPaddingByClassName(className: string): number {
    const element = this.getDivByClass(className);

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

  private getDivByClass(className: string): HTMLDivElement {
    const element = document.getElementsByClassName(
      className
    )[0] as HTMLDivElement;

    return element;
  }
  //#endregion
}
