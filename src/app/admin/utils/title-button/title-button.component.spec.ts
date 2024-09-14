import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleButtonComponent } from './title-button.component';

describe('TitleButtonComponent', () => {
  let component: TitleButtonComponent;
  let fixture: ComponentFixture<TitleButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TitleButtonComponent]
    });
    fixture = TestBed.createComponent(TitleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
