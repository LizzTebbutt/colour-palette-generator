import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RelativeColourSlidersComponent } from './relative-colour-sliders.component';
import { ColourConstants } from '../../../../classes/colour-constants';

describe('RelativeColourSlidersComponent', () => {
  let component: RelativeColourSlidersComponent;
  let fixture: ComponentFixture<RelativeColourSlidersComponent>;

  const relativeHueSliderSelector = '.relative-hue-slider input';
  const saturationSliderSelector = '.saturation-slider input';
  const valueSliderSelector = '.value-slider input';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelativeColourSlidersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelativeColourSlidersComponent);
    component = fixture.componentInstance;
    component.relativeColour = {
      hueOffset: 180,
      saturation: ColourConstants.saturationMax,
      value: ColourConstants.valueMax,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('relativeColourChange', () => {
    it('should call relativeHueChange on relative colour slider input', fakeAsync(() => {
      spyOn(component, 'relativeHueChange');

      const slider = fixture.debugElement.nativeElement.querySelector(
        relativeHueSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      tick();

      expect(component.relativeHueChange).toHaveBeenCalled();
    }));

    it('should emit the new value on relative hue slider change', fakeAsync(() => {
      spyOn(component.relativeColourChange, 'emit');

      const slider = fixture.debugElement.nativeElement.querySelector(
        relativeHueSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      tick();

      expect(component.relativeColourChange.emit).toHaveBeenCalled();
      expect(component.relativeColourChange.emit).toHaveBeenCalledWith(
        component.relativeColour
      );
    }));
  });

  describe('saturationChange', () => {
    it('should call saturationChange on saturation slider input', fakeAsync(() => {
      spyOn(component, 'saturationChange');

      const slider = fixture.debugElement.nativeElement.querySelector(
        saturationSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      tick();

      expect(component.saturationChange).toHaveBeenCalled();
    }));

    it('should emit the new value on saturation slider change', fakeAsync(() => {
      spyOn(component.relativeColourChange, 'emit');

      const slider = fixture.debugElement.nativeElement.querySelector(
        saturationSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      tick();

      expect(component.relativeColourChange.emit).toHaveBeenCalled();
      expect(component.relativeColourChange.emit).toHaveBeenCalledWith(
        component.relativeColour
      );
    }));
  });

  describe('valueChange', () => {
    it('should call valueChange on value slider input', fakeAsync(() => {
      spyOn(component, 'valueChange');

      const slider = fixture.debugElement.nativeElement.querySelector(
        valueSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      tick();

      expect(component.valueChange).toHaveBeenCalled();
    }));

    it('should emit the new value on value slider change', fakeAsync(() => {
      spyOn(component.relativeColourChange, 'emit');

      const slider = fixture.debugElement.nativeElement.querySelector(
        valueSliderSelector
      ) as HTMLInputElement;
      slider.dispatchEvent(new Event('input'));

      tick();

      expect(component.relativeColourChange.emit).toHaveBeenCalled();
      expect(component.relativeColourChange.emit).toHaveBeenCalledWith(
        component.relativeColour
      );
    }));
  });

  describe('getBackgroundOffset', () => {
    it('should offset by 100% when the anchorHue is 0', () => {
      component.containerWidth = 200;
      component.anchorHue = 0;

      const padding = 20;
      const result = component.getBackgroundOffset();
      const expectedResult = component.containerWidth - padding;

      expect(result).toBe(expectedResult);
    });

    it('should offset by 50% when the anchorHue is 180', () => {
      component.containerWidth = 200;
      component.anchorHue = 180;

      const padding = 20;
      const result = component.getBackgroundOffset();
      const expectedResult = (component.containerWidth - padding) / 2;

      expect(result).toBe(expectedResult);
    });

    it('should offset by 0% when the anchorHue is 360', () => {
      component.containerWidth = 200;
      component.anchorHue = 360;

      const result = component.getBackgroundOffset();

      expect(result).toBe(0);
    });
  });
});
