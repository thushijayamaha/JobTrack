import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';

import { ApplicationDetails } from './application-details';

describe('ApplicationDetails', () => {
  let component: ApplicationDetails;
  let fixture: ComponentFixture<ApplicationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDetails],
      providers: [provideHttpClient(), provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
