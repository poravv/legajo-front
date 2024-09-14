import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonaComponent } from './persona.component';

describe('personaComponent', () => {
  let component: PersonaComponent;
  let fixture: ComponentFixture<PersonaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonaComponent]
    });
    fixture = TestBed.createComponent(PersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
