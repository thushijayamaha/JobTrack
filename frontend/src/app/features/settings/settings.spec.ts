import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Settings } from './settings';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    document.body.classList.remove('theme-dark');
    localStorage.removeItem('jobtrack_theme');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the dark theme using the shared app class', () => {
    component.darkMode = true;

    component.applyDarkMode();

    expect(document.body.classList.contains('theme-dark')).toBeTrue();
    expect(localStorage.getItem('jobtrack_theme')).toBe('dark');
  });
});
