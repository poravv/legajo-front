import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMasivoComponent } from './delete-masivo.component';

describe('zMasivoComponent', () => {
  let component: DeleteMasivoComponent;
  let fixture: ComponentFixture<DeleteMasivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteMasivoComponent]
    });
    fixture = TestBed.createComponent(DeleteMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
