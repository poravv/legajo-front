import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonaCreateComponent } from './persona-create.component';



describe('personaCreateComponent', () => {
  let component: PersonaCreateComponent;
  let fixture: ComponentFixture<PersonaCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonaCreateComponent]
    });
    fixture = TestBed.createComponent(PersonaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
