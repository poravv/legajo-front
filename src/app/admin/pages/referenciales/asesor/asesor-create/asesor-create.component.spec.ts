import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesorCreateComponent } from './asesor-create.component';

describe('AsesorCreateComponent', () => {
  let component: AsesorCreateComponent;
  let fixture: ComponentFixture<AsesorCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsesorCreateComponent]
    });
    fixture = TestBed.createComponent(AsesorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
