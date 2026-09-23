import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { InterviewForm } from './interview-form';

describe('InterviewForm', () => {
  let component: InterviewForm;
  let fixture: ComponentFixture<InterviewForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewForm],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
