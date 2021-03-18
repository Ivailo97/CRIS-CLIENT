import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaisyConfigComponent } from './daisy-config.component';

describe('DaisyConfigComponent', () => {
  let component: DaisyConfigComponent;
  let fixture: ComponentFixture<DaisyConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaisyConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaisyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
