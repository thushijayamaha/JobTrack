import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../layout/navbar/navbar';
import { Sidebar } from '../../layout/sidebar/sidebar';

import {
  SettingsService,
  UserSettings
} from '../../core/services/settings';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {

  emailNotifications = true;
  interviewReminders = true;
  darkMode = false;

  loading = true;
  saving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    console.log('Settings component loaded');
    this.loadSettings();
  }

  loadSettings(): void {
    console.log('Loading settings...');
    
    this.loading = true;
    this.errorMessage = '';

    this.settingsService.getSettings().subscribe({
      next: (response) => {

        console.log('Settings API response:', response);

        this.emailNotifications =
          response.settings.email_notifications;

        this.interviewReminders =
          response.settings.interview_reminders;

        this.darkMode =
          response.settings.dark_mode;

        this.applyDarkMode();

        // IMPORTANT
        this.loading = false;

        console.log('Settings loaded successfully');
        console.log('Loading:', this.loading);
      },

      error: (error) => {

        console.error('Settings API error:', error);

        this.errorMessage =
          error.error?.message ||
          'Unable to load your settings.';

        this.loading = false;
      }
    });
  }

  saveSettings(): void {

    const settings: UserSettings = {
      email_notifications: this.emailNotifications,
      interview_reminders: this.interviewReminders,
      dark_mode: this.darkMode
    };

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.settingsService
      .updateSettings(settings)
      .subscribe({

        next: (response) => {

          console.log('Settings update response:', response);

          this.emailNotifications =
            response.settings.email_notifications;

          this.interviewReminders =
            response.settings.interview_reminders;

          this.darkMode =
            response.settings.dark_mode;

          this.applyDarkMode();

          this.successMessage =
            'Settings saved successfully.';

          this.saving = false;
        },

        error: (error) => {

          console.error(
            'Settings update error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to save settings.';

          this.saving = false;
        }
      });
  }

  applyDarkMode(): void {
    const isDark = this.darkMode;

    document.body.classList.toggle(
      'theme-dark',
      isDark
    );

    localStorage.setItem(
      'jobtrack_theme',
      isDark ? 'dark' : 'light'
    );
  }
}