import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { ApplicationList } from './application-list';

describe('ApplicationList', () => {
  let component: ApplicationList;
  let fixture: ComponentFixture<ApplicationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationList],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
