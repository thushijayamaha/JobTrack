import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewDetails } from './interview-details';

describe('InterviewDetails', () => {
  let component: InterviewDetails;
  let fixture: ComponentFixture<InterviewDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
