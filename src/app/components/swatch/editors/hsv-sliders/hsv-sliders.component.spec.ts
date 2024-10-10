import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HsvSlidersComponent } from './hsv-sliders.component';
import { ColourConstants } from '../../../../classes/colour-constants';
import { ColourConverterService } from '../../../../services/colour-converter/colour-converter.service';

describe('HsvSlidersComponent', () => {
  let component: HsvSlidersComponent;
  let fixture: ComponentFixture<HsvSlidersComponent>;

  const hueSliderSelector = '.hue-slider input';
  const saturationSliderSelector = '.saturation-slider input';
  const valueSliderSelector = '.value-slider input';

  const mockColourConverterService = jasmine.createSpyObj(
    'ColourConverterService',
    ['hsvToRgb', 'hsvToHex']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HsvSlidersComponent],
      providers: [
        {
          provide: ColourConverterService,
          useValue: mockColourConverterService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HsvSlidersComponent);

    component = fixture.componentInstance;
    component.colour = ColourConstants.red().hsv;

    mockColourConverterService.hsvToRgb.and.returnValue(
      ColourConstants.red().rgb
    );
    mockColourConverterService.hsvToHex.and.returnValue(
      ColourConstants.red().hex
    );

    resetSlider(hueSliderSelector, 0);
    resetSlider(saturationSliderSelector, ColourConstants.saturationMax);
    resetSlider(valueSliderSelector, ColourConstants.valueMax);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hue changes', () => {
    it('should call hueChanges on hue slider input', fakeAsync(() => {
      spyOn(component, 'hueChanges');

      const slider = fixture.debugElement.nativeElement.querySelector(
        hueSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      tick();

      expect(component.hueChanges).toHaveBeenCalled();
    }));

    it('should emit the new value on hue slider change', fakeAsync(() => {
      spyOn(component.colourChange, 'emit');

      const slider = fixture.debugElement.nativeElement.querySelector(
        hueSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      tick();

      expect(component.colourChange.emit).toHaveBeenCalled();
      expect(component.colourChange.emit).toHaveBeenCalledWith(
        component.colour
      );
    }));

    it('should update the colour variable', () => {
      const slider = fixture.debugElement.nativeElement.querySelector(
        hueSliderSelector
      ) as HTMLInputElement;

      const testValue = 10;

      slider.value = testValue.toString();
      slider.dispatchEvent(new Event('input'));

      expect(component.colour).toEqual({
        hue: testValue,
        saturation: ColourConstants.saturationMax,
        value: ColourConstants.valueMax,
      });
    });
  });

  describe('saturation changes', () => {
    it('should call saturationChanges on saturation slider input', () => {
      spyOn(component, 'saturationChanges');

      const slider = fixture.debugElement.nativeElement.querySelector(
        saturationSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      expect(component.saturationChanges).toHaveBeenCalled();
    });

    it('should emit the new value on value slider change', () => {
      spyOn(component.colourChange, 'emit');

      const slider = fixture.debugElement.nativeElement.querySelector(
        saturationSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      expect(component.colourChange.emit).toHaveBeenCalled();
      expect(component.colourChange.emit).toHaveBeenCalledWith(
        component.colour
      );
    });

    it('should update the colour variable', () => {
      component.colour = ColourConstants.red().hsv;

      fixture.detectChanges();
      const slider = fixture.debugElement.nativeElement.querySelector(
        saturationSliderSelector
      ) as HTMLInputElement;

      const testValue = 10;

      slider.value = testValue.toString();
      slider.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.colour).toEqual({
        hue: 0,
        saturation: testValue,
        value: ColourConstants.valueMax,
      });
    });
  });

  describe('value changes', () => {
    it('should call valueChanges on value slider input', () => {
      spyOn(component, 'valueChanges');

      const slider = fixture.debugElement.nativeElement.querySelector(
        valueSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      expect(component.valueChanges).toHaveBeenCalled();
    });

    it('should emit the new value on value slider change', () => {
      spyOn(component.colourChange, 'emit');

      const slider = fixture.debugElement.nativeElement.querySelector(
        valueSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      expect(component.colourChange.emit).toHaveBeenCalled();
      expect(component.colourChange.emit).toHaveBeenCalledWith(
        component.colour
      );
    });

    it('should update the colour variable', () => {
      component.colour = ColourConstants.red().hsv;
      const slider = fixture.debugElement.nativeElement.querySelector(
        valueSliderSelector
      ) as HTMLInputElement;

      const testValue = 10;

      slider.value = testValue.toString();
      slider.dispatchEvent(new Event('input'));

      expect(component.colour).toEqual({
        hue: 0,
        saturation: ColourConstants.saturationMax,
        value: testValue,
      });
    });
  });

  describe('getRgbColourString', () => {
    it('should return an rgb colour string', () => {
      const expectedColourString = ColourConstants.red().rgbCssCode;
      const colourString = component.getRgbColourString(component.colour);

      expect(colourString).toBe(expectedColourString);
    });
  });

  function resetSlider(selector: string, value: number) {
    const slider = fixture.debugElement.nativeElement.querySelector(
      selector
    ) as HTMLInputElement;
    slider.value = value.toString();
    slider.dispatchEvent(new Event('input'));
  }
});
