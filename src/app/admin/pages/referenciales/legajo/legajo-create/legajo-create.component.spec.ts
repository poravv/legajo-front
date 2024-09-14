import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegajoCreateComponent } from './legajo-create.component';

describe('LegajoCreateComponent', () => {
  let component: LegajoCreateComponent;
  let fixture: ComponentFixture<LegajoCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegajoCreateComponent]
    });
    fixture = TestBed.createComponent(LegajoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
