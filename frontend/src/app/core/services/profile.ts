import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ProfileResponse {
  success: boolean;
  user: UserProfile;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://127.0.0.1:8000/api/auth/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.apiUrl);
  }

  updateProfile(
    name: string,
    email: string
  ): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(this.apiUrl, {
      name,
      email
    });
  }
}