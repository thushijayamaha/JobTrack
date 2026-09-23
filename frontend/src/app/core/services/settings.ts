import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserSettings {
  email_notifications: boolean;
  interview_reminders: boolean;
  dark_mode: boolean;
}

interface SettingsResponse {
  success: boolean;
  settings: UserSettings;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly apiUrl =
    'http://127.0.0.1:8000/api/auth/settings';

  constructor(
    private http: HttpClient
  ) {}

  getSettings(): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(
      this.apiUrl
    );
  }

  updateSettings(
    settings: UserSettings
  ): Observable<SettingsResponse> {

    return this.http.put<SettingsResponse>(
      this.apiUrl,
      settings
    );
  }
}