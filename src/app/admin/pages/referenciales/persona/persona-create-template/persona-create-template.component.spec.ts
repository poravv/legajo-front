import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaCreateTemplateComponent } from './persona-create-template.component';

describe('PersonaCreateTemplateComponent', () => {
  let component: PersonaCreateTemplateComponent;
  let fixture: ComponentFixture<PersonaCreateTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonaCreateTemplateComponent]
    });
    fixture = TestBed.createComponent(PersonaCreateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
