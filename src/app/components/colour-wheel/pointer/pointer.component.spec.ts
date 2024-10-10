import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointerComponent } from './pointer.component';
import { ColourConstants } from '../../../classes/colour-constants';
import { FormattingConstants } from '../../../classes/formatting-constants';
import { ComponentRef } from '@angular/core';

describe('PointerComponent', () => {
  let fixture: ComponentFixture<PointerComponent>;
  let component: PointerComponent;
  let componentRef: ComponentRef<PointerComponent>;
  const pointerSelector = '.pointer';
  const armSelector = '.arm';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PointerComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    component.colour = ColourConstants.red().hsv;
    component.wheelDiameter = FormattingConstants.defaultWheelDiameter;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getPointerTransformation', () => {
    it('should return a valid css transformation', () => {
      const expectedTranslation = FormattingConstants.defaultWheelDiameter / 2;

      const transformation = component.getPointerTransformation();

      expect(transformation).toBe(
        `rotate(${component.colour.hue}deg) translateY(${-expectedTranslation}px)`
      );
    });
  });

  describe('getArmTransformation', () => {
    it('should return a valid css transformation', () => {
      const expectedTranslation = FormattingConstants.defaultWheelDiameter / 2;

      const transformation = component.getArmTransformation();

      expect(transformation).toBe(
        `rotate(${component.colour.hue}deg) translateY(${-expectedTranslation / 2}px) scaleY(${expectedTranslation})`
      );
    });
  });

  describe('calculatePointerTranslation', () => {
    it('should return the correct translation when the diameter and saturation are left default', () => {
      const expectedTranslation = FormattingConstants.defaultWheelDiameter / 2;

      const translation = component.calculatePointerTranslation();

      expect(translation).toBe(expectedTranslation);
    });

    it('should return the correct translation when the diameter is changed', () => {
      const testDiameter = FormattingConstants.defaultWheelDiameter / 2;
      component.wheelDiameter = testDiameter;
      const expectedTranslation = component.wheelDiameter / 2;

      const translation = component.calculatePointerTranslation();

      expect(translation).toBe(expectedTranslation);
    });

    it('should return the correct translation when the saturation is changed', () => {
      const testSaturation = ColourConstants.saturationMax / 2;
      component.colour.saturation = testSaturation;
      const expectedTranslation = FormattingConstants.defaultWheelDiameter / 4;

      const translation = component.calculatePointerTranslation();

      expect(translation).toBe(expectedTranslation);
    });

    it('should return the correct translation when the diameter and saturation are both changed', () => {
      const testSaturation = ColourConstants.saturationMax / 2;
      component.colour.saturation = testSaturation;
      const testDiameter = FormattingConstants.defaultWheelDiameter / 2;
      component.wheelDiameter = testDiameter;
      const expectedTranslation = component.wheelDiameter / 4;

      const translation = component.calculatePointerTranslation();

      expect(translation).toBe(expectedTranslation);
    });

    it('should return 0 when the diameter is negative', () => {
      const testDiameter = -100;
      component.wheelDiameter = testDiameter;
      const expectedPointerTranslation = 0;

      const distance = component.calculatePointerTranslation();

      expect(distance).toBe(expectedPointerTranslation);
    });

    it('should return the wheel radius when the saturation is over the maximum', () => {
      const testSaturation = ColourConstants.saturationMax + 10;
      component.colour.saturation = testSaturation;
      const expectedPointerTranslation = component.wheelDiameter / 2;

      const distance = component.calculatePointerTranslation();

      expect(distance).toBe(expectedPointerTranslation);
    });

    it('should return 0 when the saturation is negative', () => {
      const testSaturation = -1;
      component.colour.saturation = testSaturation;
      const expectedPointerTranslation = 0;

      const distance = component.calculatePointerTranslation();

      expect(distance).toBe(expectedPointerTranslation);
    });
  });

  describe('calculateArmTranslation', () => {
    it('should return half the distance that calculatePointerTranslation returns', () => {
      const expectedPointerTranslation =
        FormattingConstants.defaultWheelDiameter / 2;
      const expectedArmTranslation = expectedPointerTranslation / 2;

      const distance = component.calculatePointerTranslation();
      const armDistance = component.calculateArmTranslation();

      expect(distance).toBe(expectedPointerTranslation);
      expect(armDistance).toBe(expectedArmTranslation);
    });
  });

  describe('calculatePointerMargins', () => {
    it('should return the correct margin when the diameter and pointer size are left default', () => {
      const expectedMargin =
        (FormattingConstants.defaultWheelDiameter -
          FormattingConstants.defaultPointerDiameter) /
        2;

      const margin = component.calculatePointerMargins();

      expect(margin).toBe(expectedMargin);
    });

    it('should return the correct margin when the diameter is modified', () => {
      const testDiameter = FormattingConstants.defaultWheelDiameter / 2;
      component.wheelDiameter = testDiameter;
      const expectedMargin =
        (component.wheelDiameter - FormattingConstants.defaultPointerDiameter) /
        2;

      const margin = component.calculatePointerMargins();

      expect(margin).toBe(expectedMargin);
    });

    it('should return the correct margin when the pointer size is modified', () => {
      const testPointerSize = FormattingConstants.defaultPointerDiameter / 2;
      component.pointerSize = testPointerSize;
      const expectedMargin =
        (FormattingConstants.defaultWheelDiameter - component.pointerSize) / 2;

      const margin = component.calculatePointerMargins();

      expect(margin).toBe(expectedMargin);
    });

    it('should return 0 when diameter is negative', () => {
      const testDiameter = -FormattingConstants.defaultWheelDiameter;
      component.wheelDiameter = testDiameter;

      const margin = component.calculatePointerMargins();

      expect(margin).toBe(0);
    });

    it('should return 0 when pointer size is larger than the diameter', () => {
      const testDiameter = 0;
      component.wheelDiameter = testDiameter;

      const margin = component.calculatePointerMargins();

      expect(margin).toBe(0);
    });
  });

  describe('calculateArmMargins', () => {
    it('should return the correct margin when the diameter and arm width are left default', () => {
      const expectedMargin =
        (FormattingConstants.defaultWheelDiameter -
          FormattingConstants.defaultArmWidth) /
        2;

      const margin = component.calculateArmMargins();

      expect(margin).toBe(expectedMargin);
    });

    it('should return the correct margin when the diameter is modified', () => {
      const testDiameter = FormattingConstants.defaultWheelDiameter / 2;
      component.wheelDiameter = testDiameter;
      const expectedMargin =
        (component.wheelDiameter - FormattingConstants.defaultArmWidth) / 2;

      const margin = component.calculateArmMargins();

      expect(margin).toBe(expectedMargin);
    });

    it('should return the correct margin when the arm width is modified', () => {
      const testArmWidth = FormattingConstants.defaultArmWidth / 2;
      component.armWidth = testArmWidth;
      const expectedMargin =
        (FormattingConstants.defaultWheelDiameter - component.armWidth) / 2;

      const margin = component.calculateArmMargins();

      expect(margin).toBe(expectedMargin);
    });

    it('should return 0 when diameter is negative', () => {
      const testDiameter = -FormattingConstants.defaultWheelDiameter;
      component.wheelDiameter = testDiameter;

      const margin = component.calculateArmMargins();

      expect(margin).toBe(0);
    });

    it('should return 0 when arm width is larger than the diameter', () => {
      const testDiameter = 0;
      component.wheelDiameter = testDiameter;

      const margin = component.calculateArmMargins();

      expect(margin).toBe(0);
    });
  });

  describe('inputs', () => {
    describe('wheelDiameter', () => {
      it('should be set to defaultWheelDiameter by default', () => {
        expect(component.wheelDiameter).toBe(
          FormattingConstants.defaultWheelDiameter
        );
      });

      it('should overwrite the default when the input is positive', () => {
        const input = FormattingConstants.defaultWheelDiameter / 2;

        componentRef.setInput('wheelDiameter', input);
        fixture.detectChanges();

        expect(component.wheelDiameter).toBe(input);
      });

      it('should overwrite the default when the input is 0', () => {
        const input = 0;

        componentRef.setInput('wheelDiameter', input);
        fixture.detectChanges();

        expect(component.wheelDiameter).toBe(input);
      });

      it('should return to the default when the input is negative', () => {
        const input = -FormattingConstants.defaultWheelDiameter;

        componentRef.setInput('wheelDiameter', input);
        fixture.detectChanges();

        expect(component.wheelDiameter).toBe(
          FormattingConstants.defaultWheelDiameter
        );
      });
    });

    describe('pointerSize', () => {
      it('should be set to defaultPointerSize by default', () => {
        expect(component.pointerSize).toBe(
          FormattingConstants.defaultPointerDiameter
        );
      });

      it('should overwrite the default when the input is positive', () => {
        const input = FormattingConstants.defaultPointerDiameter / 2;

        componentRef.setInput('pointerSize', input);
        fixture.detectChanges();

        expect(component.pointerSize).toBe(input);
      });

      it('should overwrite the default when the input is 0', () => {
        const input = 0;

        componentRef.setInput('pointerSize', input);
        fixture.detectChanges();

        expect(component.pointerSize).toBe(input);
      });

      it('should return to the default when the input is negative', () => {
        const input = -FormattingConstants.defaultPointerDiameter;

        componentRef.setInput('pointerSize', input);
        fixture.detectChanges();

        expect(component.pointerSize).toBe(
          FormattingConstants.defaultPointerDiameter
        );
      });
    });

    describe('armWidth', () => {
      it('should be set to defaultArmWidth by default', () => {
        expect(component.armWidth).toBe(FormattingConstants.defaultArmWidth);
      });

      it('should overwrite the default when the input is positive', () => {
        const input = FormattingConstants.defaultArmWidth / 2;

        componentRef.setInput('armWidth', input);
        fixture.detectChanges();

        expect(component.armWidth).toBe(input);
      });

      it('should overwrite the default when the input is 0', () => {
        const input = 0;

        componentRef.setInput('armWidth', input);
        fixture.detectChanges();

        expect(component.armWidth).toBe(input);
      });

      it('should return to the default when the input is negative', () => {
        const input = -FormattingConstants.defaultArmWidth;

        componentRef.setInput('armWidth', input);
        fixture.detectChanges();

        expect(component.armWidth).toBe(FormattingConstants.defaultArmWidth);
      });
    });
  });

  describe('html rendering', () => {
    describe('pointer height and width', () => {
      it('should be set in the html correctly', () => {
        const element = fixture.debugElement.nativeElement.querySelector(
          pointerSelector
        ) as HTMLElement;

        expect(element).toBeTruthy();
        expect(element?.style.width).toBe(component.pointerSize + 'px');
        expect(element?.style.height).toBe(component.pointerSize + 'px');
      });

      it('should update when pointerSize is changed', () => {
        const testPointerSize = 10;
        componentRef.setInput('pointerSize', testPointerSize);
        fixture.detectChanges();

        const element = fixture.debugElement.nativeElement.querySelector(
          pointerSelector
        ) as HTMLElement;

        expect(element).toBeTruthy();
        expect(element?.style.width).toBe(testPointerSize + 'px');
        expect(element?.style.height).toBe(testPointerSize + 'px');
      });

      it('should revert to the default when pointerSize is negative', () => {
        const testPointerSize = -10;
        componentRef.setInput('pointerSize', testPointerSize);
        fixture.detectChanges();

        const element = fixture.debugElement.nativeElement.querySelector(
          pointerSelector
        ) as HTMLElement;

        expect(element).toBeTruthy();
        expect(element?.style.width).toBe(
          FormattingConstants.defaultPointerDiameter + 'px'
        );
        expect(element?.style.height).toBe(
          FormattingConstants.defaultPointerDiameter + 'px'
        );
      });
    });

    describe('arm width', () => {
      it('should be set in the html correctly', () => {
        const element = fixture.debugElement.nativeElement.querySelector(
          armSelector
        ) as HTMLElement;

        expect(element).toBeTruthy();
        expect(element?.style.width).toBe(component.armWidth + 'px');
      });

      it('should update when armWidth is changed', () => {
        const testArmWidth = 10;
        componentRef.setInput('armWidth', testArmWidth);
        fixture.detectChanges();

        const element = fixture.debugElement.nativeElement.querySelector(
          armSelector
        ) as HTMLElement;

        expect(element).toBeTruthy();
        expect(element?.style.width).toBe(testArmWidth + 'px');
      });

      it('should revert to the default when armWidth is negative', () => {
        const testArmWidth = -10;
        componentRef.setInput('armWidth', testArmWidth);
        fixture.detectChanges();

        const element = fixture.debugElement.nativeElement.querySelector(
          armSelector
        ) as HTMLElement;

        expect(element).toBeTruthy();
        expect(element?.style.width).toBe(
          FormattingConstants.defaultArmWidth + 'px'
        );
      });
    });

    describe('pointer margin', () => {
      it('should be set in the html correctly', () => {
        const expectedMargin = component.calculatePointerMargins();

        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector(
          pointerSelector
        ) as HTMLElement;

        expect(element?.style.margin).toBe(`${expectedMargin}px`);
      });

      it('should update when the wheelDiameter updates', () => {
        const testWheelDiameter = FormattingConstants.defaultWheelDiameter / 2;
        componentRef.setInput('wheelDiameter', testWheelDiameter);
        const expectedMargin = component.calculatePointerMargins();

        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector(
          pointerSelector
        ) as HTMLElement;

        expect(element?.style.margin).toBe(`${expectedMargin}px`);
      });
    });

    describe('arm margin', () => {
      it('should be set in the html correctly', () => {
        const expectedMargin = component.calculateArmMargins();

        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector(
          armSelector
        ) as HTMLElement;

        expect(element?.style.margin).toBe(`${expectedMargin}px`);
      });

      it('should update when the wheelDiameter updates', () => {
        const testWheelDiameter = FormattingConstants.defaultWheelDiameter / 2;
        componentRef.setInput('wheelDiameter', testWheelDiameter);
        const expectedMargin = component.calculateArmMargins();

        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector(
          armSelector
        ) as HTMLElement;

        expect(element?.style.margin).toBe(`${expectedMargin}px`);
      });
    });

    describe('pointer transformation', () => {
      it('should translate the pointer html element correctly', () => {
        const expectedTransform = component.getPointerTransformation();

        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector(
          pointerSelector
        ) as HTMLElement;

        expect(element?.style.transform).toBe(expectedTransform);
      });

      it('should update the pointer html element transformation when the wheelDiameter updates', () => {
        const testWheelDiameter = FormattingConstants.defaultWheelDiameter / 2;
        componentRef.setInput('wheelDiameter', testWheelDiameter);
        const expectedTransform = component.getPointerTransformation();

        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector(
          pointerSelector
        ) as HTMLElement;

        expect(element?.style.transform).toBe(expectedTransform);
      });
    });

    describe('arm transformation', () => {
      it('should translate the arm html element correctly', () => {
        const expectedTransform = component.getArmTransformation();

        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector(
          armSelector
        ) as HTMLElement;

        expect(element?.style.transform).toBe(expectedTransform);
      });

      it('should update the arm html element transformation when the wheelDiameter updates', () => {
        const testWheelDiameter = FormattingConstants.defaultWheelDiameter / 2;
        componentRef.setInput('wheelDiameter', testWheelDiameter);

        const expectedTransform = component.getArmTransformation();

        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector(
          armSelector
        ) as HTMLElement;

        expect(element?.style.transform).toBe(expectedTransform);
      });
    });
  });
});
