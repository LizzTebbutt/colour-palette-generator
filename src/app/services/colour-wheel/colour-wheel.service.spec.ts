import { TestBed } from '@angular/core/testing';

import { ColourWheelService } from './colour-wheel.service';
import { AnchorColour } from '../../classes/anchor-colour/anchor-colour';
import { ColourConstants } from '../../classes/colour-constants';
import { RelativeColour } from '../../types/relativeColour';
import { hsvColour } from '../../types/hsvColour';
import { ColourMathsService } from '../colour-maths/colour-maths.service';
import { FormattingConstants } from '../../classes/formatting-constants';

describe('ColourWheelServiceService', () => {
  let service: ColourWheelService;

  const mockColourMathsService = jasmine.createSpyObj('ColourMathsService', [
    'hsvColourIsOutOfBounds',
    'correctHsvColour',
    'rgbColourIsOutOfBounds',
    'correctRgbColour',
    'calculateHueByCoordinates',
    'calculateSaturationByCoordinates',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ColourMathsService,
          useValue: mockColourMathsService,
        },
      ],
    });

    service = TestBed.inject(ColourWheelService);

    mockColourMathsService.calculateHueByCoordinates.and.returnValue(0);
    mockColourMathsService.calculateSaturationByCoordinates.and.returnValue(0);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('colourWheelMousedown', () => {
    it('should not update anything if isChanging is true', () => {
      const testAnchorColour = newAnchorColour(ColourConstants.blue().hsv);

      setInitialServiceState(true, newAnchorColour(), newRelativeColour());

      service.colourWheelMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor?.colour).not.toBe(testAnchorColour.colour);
    });

    it('should set isChanging to true if it is false', () => {
      const testAnchorColour = newAnchorColour();
      setInitialServiceState(false, testAnchorColour, newRelativeColour());

      service.colourWheelMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.isChanging).toBeTrue();
    });

    it('should set the selectedAnchor', () => {
      const testAnchorColour = newAnchorColour();
      setInitialServiceState(false, undefined, undefined);

      service.colourWheelMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor).toBe(testAnchorColour);
    });

    it('should update the anchor colour', () => {
      const testAnchorColour = newAnchorColour();
      setInitialServiceState(false, undefined, undefined);

      service.colourWheelMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor?.colour.hue).toBe(0);
      expect(service.selectedAnchor?.colour.saturation).toBe(0);
    });
  });

  describe('anchorPointerMousedown', () => {
    it('should set isChanging to true', () => {
      const testAnchorColour = newAnchorColour();
      setInitialServiceState(false, testAnchorColour, newRelativeColour());

      service.anchorPointerMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.isChanging).toBeTrue();
    });

    it('should set the selectedAnchor', () => {
      const testAnchorColour = newAnchorColour();
      setInitialServiceState(false, undefined, undefined);

      service.anchorPointerMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor).toBe(testAnchorColour);
    });

    it('should update the anchor colour', () => {
      const testAnchorColour = newAnchorColour();
      setInitialServiceState(false, undefined, undefined);

      service.anchorPointerMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor?.colour.hue).toBe(0);
      expect(service.selectedAnchor?.colour.saturation).toBe(0);
    });
  });

  describe('relativePointerMousedown', () => {
    it('should set isChanging to true', () => {
      const testAnchorColour = newAnchorColour();
      const testRelativeColour = newRelativeColour();
      setInitialServiceState(false, testAnchorColour, testRelativeColour);

      service.relativePointerMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        testRelativeColour,
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.isChanging).toBeTrue();
    });

    it('should set the selectedAnchor', () => {
      const testAnchorColour = newAnchorColour();
      setInitialServiceState(false, undefined, undefined);

      service.relativePointerMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        newRelativeColour(),
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor).toBe(testAnchorColour);
    });

    it('should set the selectedRelativeColour', () => {
      const testRelativeColour = newRelativeColour();
      setInitialServiceState(false, undefined, undefined);

      service.relativePointerMousedown(
        new MouseEvent('click'),
        newAnchorColour(),
        testRelativeColour,
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedRelativeColour).toBe(testRelativeColour);
    });

    it('should update the anchor colour', () => {
      const testAnchorColour = newAnchorColour();
      setInitialServiceState(false, undefined, undefined);

      service.relativePointerMousedown(
        new MouseEvent('click'),
        testAnchorColour,
        newRelativeColour(),
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor?.colour.hue).toBe(0);
      expect(service.selectedAnchor?.colour.saturation).toBe(100);
    });
  });

  describe('updateColour', () => {
    it('should not update anything if isChanging is false', () => {
      setInitialServiceState(false, newAnchorColour(), newRelativeColour());

      service.updateColour(
        new MouseEvent('click'),
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor).not.toBeUndefined();
      expect(service.selectedRelativeColour).not.toBeUndefined();
    });

    it('should update the relative colour if selectedRelativeColour is set', () => {
      setInitialServiceState(false, newAnchorColour(), newRelativeColour());

      service.updateColour(
        new MouseEvent('click'),
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor).not.toBeUndefined();
      expect(service.selectedRelativeColour).not.toBeUndefined();
    });

    it('should update the anchor colour if selectedRelativeColour is not set and selectedAnchor is', () => {
      setInitialServiceState(false, newAnchorColour(), undefined);

      service.updateColour(
        new MouseEvent('click'),
        FormattingConstants.defaultWheelDiameter
      );

      expect(service.selectedAnchor).not.toBeUndefined();
      expect(service.selectedRelativeColour).toBeUndefined();
    });
  });

  describe('stopUpdatingColour', () => {
    it('should set isChanging to false', () => {
      service.isChanging = true;

      service.stopUpdatingColour();

      expect(service.isChanging).toBeFalse();
    });
    it('should set selectedAnchor to undefined', () => {
      service.selectedAnchor = newAnchorColour();

      service.stopUpdatingColour();

      expect(service.selectedAnchor).toBeUndefined();
    });
    it('should set selectedRelativeColour to undefined', () => {
      service.selectedRelativeColour = {} as RelativeColour;

      service.stopUpdatingColour();

      expect(service.selectedAnchor).toBeUndefined();
    });
  });

  function newAnchorColour(
    hsvColour: hsvColour = ColourConstants.red().hsv
  ): AnchorColour {
    return new AnchorColour(hsvColour, []);
  }

  function newRelativeColour(): RelativeColour {
    return {} as RelativeColour;
  }

  function setInitialServiceState(
    isChanging: boolean,
    selectedAnchor?: AnchorColour,
    selectedRelativeColour?: RelativeColour
  ) {
    service.isChanging = isChanging;
    service.selectedAnchor = selectedAnchor;
    service.selectedRelativeColour = selectedRelativeColour;
  }
});
