import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonaGesDayComponent } from './personagesday.component';


describe('PersonaGesDayComponent', () => {
  let component: PersonaGesDayComponent;
  let fixture: ComponentFixture<PersonaGesDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonaGesDayComponent]
    });
    fixture = TestBed.createComponent(PersonaGesDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
