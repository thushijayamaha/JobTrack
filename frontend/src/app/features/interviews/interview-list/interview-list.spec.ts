import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewList } from './interview-list';

describe('InterviewList', () => {
  let component: InterviewList;
  let fixture: ComponentFixture<InterviewList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewList],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
