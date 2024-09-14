import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMasivoComponent } from './create-masivo.component';

describe('CreateMasivoComponent', () => {
  let component: CreateMasivoComponent;
  let fixture: ComponentFixture<CreateMasivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMasivoComponent]
    });
    fixture = TestBed.createComponent(CreateMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
