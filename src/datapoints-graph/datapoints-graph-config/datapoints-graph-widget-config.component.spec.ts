import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DatapointsGraphWidgetConfigComponent } from './datapoints-graph-widget-config.component';
import {
  CommonModule,
  DynamicComponentAlertAggregator,
  FormsModule,
} from '@c8y/ngx-components';
import { TimeControlsModule } from '../time-controls';
import { ChartsComponent } from '../charts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import {
  DatapointsGraphKPIDetails,
  DatapointsGraphWidgetConfig,
  DATE_SELECTION,
} from '../model';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DatapointSelectorModule } from '@c8y/ngx-components/datapoint-selector';
import { aggregationType } from '@c8y/client';
import { AnimationBuilder } from '@angular/animations';
import { take } from 'rxjs/operators';

describe('DatapointsGraphWidgetConfigComponent', () => {
  let component: DatapointsGraphWidgetConfigComponent;
  let fixture: ComponentFixture<DatapointsGraphWidgetConfigComponent>;
  let ngForm: NgForm;
  const originalResizeObserver = window.ResizeObserver;
  const dateFrom = new Date('2023-03-19T11:00:19.710Z');
  const dateTo = new Date('2023-03-20T11:00:19.710Z');
  const dp: DatapointsGraphKPIDetails = {
    fragment: 'c8y_Temperature',
    series: 'T',
    __active: true,
  };
  const config: DatapointsGraphWidgetConfig = {
    datapoints: [],
    dateFrom,
    dateTo,
  };

  beforeAll(() => {
    class ResizeObserverMock {
      observe = jest.fn().mockName('observe').mockImplementation();
      unobserve = jest.fn().mockName('unobserve').mockImplementation();
      disconnect = jest.fn().mockName('disconnect').mockImplementation();
    }
    window.ResizeObserver = ResizeObserverMock;
  });

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule.forRoot(),
        TimeControlsModule,
        ChartsComponent,
        TooltipModule,
        FormsModule,
        ReactiveFormsModule,
        PopoverModule,
        DatapointSelectorModule,
      ],
      declarations: [DatapointsGraphWidgetConfigComponent],
      providers: [
        { provide: window, useValue: { ResizeObserver: {} } },
        NgForm,
        { provide: AnimationBuilder, useValue: { build: () => null } },
      ],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(DatapointsGraphWidgetConfigComponent);
    ngForm = TestBed.inject(NgForm);

    component = fixture.componentInstance;
    component.alerts = new DynamicComponentAlertAggregator();
    component.config = config;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form', () => {
      // given
      jest.spyOn(component, 'timePropsChanged');
      jest.spyOn(ngForm.form, 'addControl');
      // when
      component.ngOnInit();
      // then
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup.value).toEqual({
        aggregation: null,
        datapoints: config.datapoints,
        dateFrom: config.dateFrom,
        dateTo: config.dateTo,
        displayAggregationSelection: false,
        displayDateSelection: false,
        interval: 'hours',
        realtime: false,
        widgetInstanceGlobalTimeContext: false,
        canDecoupleGlobalTimeContext: false,
        xAxisSplitLines: false,
        yAxisSplitLines: false,
      });
      expect(ngForm.form.addControl).toHaveBeenCalledWith(
        'config',
        component.formGroup
      );
    });

    describe('should init date selection', () => {
      it('as dashboard context', () => {
        // given
        component.config = {
          ...component.config,
          widgetInstanceGlobalTimeContext: true,
        };
        // when
        fixture.detectChanges();
        // then
        expect(component.dateSelection).toBe(DATE_SELECTION.DASHBOARD_CONTEXT);
      });

      it('as view and config', () => {
        // given
        component.config = { ...component.config, displayDateSelection: true };
        // when
        fixture.detectChanges();
        // then
        expect(component.dateSelection).toBe(DATE_SELECTION.VIEW_AND_CONFIG);
      });

      it('as config only', () => {
        // when
        fixture.detectChanges();
        // then
        expect(component.dateSelection).toBe(DATE_SELECTION.CONFIG);
      });
    });

    it('subscribe to form value changes', fakeAsync(() => {
      // given
      fixture.detectChanges();
      // when
      component.formGroup.patchValue({ aggregation: aggregationType.MINUTELY });
      tick();
      // then
      expect(component.config.aggregation).toBe(aggregationType.MINUTELY);
    }));
  });

  describe('onBeforeSave', () => {
    it('when form is valid', () => {
      // given
      jest.spyOn(component, 'timePropsChanged');
      component.config = { ...config, datapoints: [dp] };
      const configToSave: DatapointsGraphWidgetConfig = { datapoints: [] };
      component.ngOnInit();
      // when
      const result = component.onBeforeSave(configToSave);
      // then
      expect(result).toBeTruthy();
      expect(configToSave).toEqual({
        aggregation: null,
        datapoints: [dp],
        dateFrom: config.dateFrom,
        dateTo: config.dateTo,
        displayAggregationSelection: false,
        displayDateSelection: false,
        interval: 'hours',
        realtime: false,
        widgetInstanceGlobalTimeContext: false,
        canDecoupleGlobalTimeContext: false,
        xAxisSplitLines: false,
        yAxisSplitLines: false,
      });
    });

    it('when form is invalid', () => {
      // given
      fixture.detectChanges();
      component.formGroup.patchValue({ dateFrom: null });
      // when
      const result = component.onBeforeSave(null);
      // then
      expect(result).toBeFalsy();
    });
  });

  describe('dateSelectionChange', () => {
    it('when dateSelection is "config"', () => {
      // given
      fixture.detectChanges();
      // when
      component.dateSelectionChange(DATE_SELECTION.CONFIG);
      // then
      expect(component.formGroup.value.displayDateSelection).toBe(false);
      expect(component.formGroup.value.widgetInstanceGlobalTimeContext).toBe(
        false
      );
    });

    it('when dateSelection is "view_and_config"', () => {
      // given
      fixture.detectChanges();
      // when
      component.dateSelectionChange(DATE_SELECTION.VIEW_AND_CONFIG);
      // then
      expect(component.formGroup.value.displayDateSelection).toBe(true);
      expect(component.formGroup.value.widgetInstanceGlobalTimeContext).toBe(
        false
      );
    });

    it('when dateSelection is "dashboard_context"', () => {
      // given
      fixture.detectChanges();
      // when
      component.dateSelectionChange(DATE_SELECTION.DASHBOARD_CONTEXT);
      // then
      expect(component.formGroup.value.displayDateSelection).toBe(false);
      expect(component.formGroup.value.widgetInstanceGlobalTimeContext).toBe(
        true
      );
      expect(component.formGroup.value.realtime).toBe(false);
    });
  });

  it('timePropsChanged should update form value but should not invoke valueChange', fakeAsync(() => {
    // given
    const newDateFrom = new Date('2023-03-15T11:00:19.710Z');
    let formValue;
    fixture.detectChanges();
    component.formGroup.valueChanges.pipe(take(1)).subscribe((val) => {
      formValue = val;
    });
    // when
    component.timePropsChanged({ dateFrom: newDateFrom });
    tick();
    // then
    expect(formValue.dateFrom).toBe(newDateFrom);
  }));

  it('updateTimeRangeOnRealtime should update form value but should not invoke valueChange', fakeAsync(() => {
    // given
    const newDateFrom = new Date('2023-03-15T11:00:19.710Z');
    let formValue;
    fixture.detectChanges();
    component.formGroup.valueChanges.pipe(take(1)).subscribe((val) => {
      formValue = val;
    });
    // when
    component.updateTimeRangeOnRealtime({ dateFrom: newDateFrom });
    tick();
    // then
    expect(formValue).toBe(undefined);
  }));
});
