import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SliderComponent } from './slider.component';
import { ColourConstants } from '../../classes/colour-constants';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getGradient', () => {
    it('should not return a gradient if colourFrom is not provided', () => {
      let testGradient = component.getGradient();

      expect(testGradient).toBe('');

      component.backgroundColourFrom = ColourConstants.red().hsv;
      testGradient = component.getGradient();

      expect(testGradient).toBe('');
    });

    it('should not return a gradient if colourTo is not provided', () => {
      let testGradient = component.getGradient();

      expect(testGradient).toBe('');

      component.backgroundColourTo = ColourConstants.red().hsv;
      testGradient = component.getGradient();

      expect(testGradient).toBe('');
    });

    it('should return in the correct format when colourFrom and colourTo are provided', () => {
      component.backgroundColourFrom = ColourConstants.green().hsv;
      component.backgroundColourTo = ColourConstants.red().hsv;

      const expectedGradient = `linear-gradient(0.25turn, ${ColourConstants.green().hex}, ${ColourConstants.red().hex})`;

      const testGradient = component.getGradient();
      expect(testGradient).toBe(expectedGradient);
    });
  });

  describe('sliderValueChange', () => {
    it('should emit an event when the value changes', () => {
      spyOn(component.valueChange, 'emit');

      const input: HTMLInputElement =
        fixture.debugElement.nativeElement.querySelector(
          'input'
        ) as HTMLInputElement;
      input.value = '50';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.valueChange.emit).toHaveBeenCalled();
      expect(input.value).toBe('50');
      expect(component.value).toBe(50);
    });

    it('should call sliderChange when an event is emitted', () => {
      spyOn(component, 'sliderValueChange');

      const input: HTMLInputElement =
        fixture.debugElement.nativeElement.querySelector(
          'input'
        ) as HTMLInputElement;
      input.value = '50';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.sliderValueChange).toHaveBeenCalled();
    });
  });

  describe('html', () => {
    describe('slider', () => {
      it('should set the range correctly', () => {
        const testMinimum = 10;
        const testMaximum = 20;

        component.min = testMinimum;
        component.max = testMaximum;

        fixture.detectChanges();

        const input: HTMLInputElement =
          fixture.debugElement.nativeElement.querySelector(
            'input'
          ) as HTMLInputElement;

        const actualMinimum = input.min;
        const actualMaximum = input.max;

        expect(actualMaximum).toBe(testMaximum.toString());
        expect(actualMinimum).toBe(testMinimum.toString());
      });

      it('should set the step size correctly', () => {
        const testStepSize = 10;

        component.step = testStepSize;

        fixture.detectChanges();

        const input: HTMLInputElement =
          fixture.debugElement.nativeElement.querySelector(
            'input'
          ) as HTMLInputElement;

        const actualStepSize = input.step;

        expect(actualStepSize).toBe(testStepSize.toString());
      });

      it('should set the value correctly', () => {
        const testValue = 10;

        component.value = testValue;

        fixture.detectChanges();

        const input: HTMLInputElement =
          fixture.debugElement.nativeElement.querySelector(
            'input'
          ) as HTMLInputElement;

        const actualValue = input.value;

        expect(actualValue).toBe(testValue.toString());
      });

      it('should set the background gradient correctly', () => {
        component.backgroundColourFrom = ColourConstants.green().hsv;
        component.backgroundColourTo = ColourConstants.red().hsv;
        const testBackgroundGradient = `linear-gradient(0.25turn, ${ColourConstants.green().rgbCssCode}, ${ColourConstants.red().rgbCssCode})`;

        fixture.detectChanges();

        const input: HTMLInputElement =
          fixture.debugElement.nativeElement.querySelector(
            'input'
          ) as HTMLInputElement;

        const actualBackgroundGradient = input.style.background;

        expect(actualBackgroundGradient).toBe(testBackgroundGradient);
      });

      it('should set the background offset correctly', () => {
        const testBackgroundOffset = 10;

        component.backgroundOffset = testBackgroundOffset;

        fixture.detectChanges();

        const input: HTMLInputElement =
          fixture.debugElement.nativeElement.querySelector(
            'input'
          ) as HTMLInputElement;

        const actualBackgroundOffset = input.style.backgroundPositionX;

        expect(actualBackgroundOffset).toBe(
          testBackgroundOffset.toString() + 'px'
        );
      });
    });
  });
});
