import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { InterviewDetails } from './interview-details';
import { InterviewService } from '../../../core/services/interview';

describe('InterviewDetails', () => {
  let component: InterviewDetails;
  let fixture: ComponentFixture<InterviewDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        },
        {
          provide: InterviewService,
          useValue: {
            getInterviewById: () => of({
              id: 1,
              application_id: 1,
              interview_date: '2026-09-23',
              interview_time: '10:00',
              interview_type: 'Online',
              status: 'Scheduled'
            })
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
