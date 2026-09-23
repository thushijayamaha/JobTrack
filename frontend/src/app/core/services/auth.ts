import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api/auth';
  private readonly tokenKey = 'jobtrack_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string, remember = true): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(response => this.storeSession(response, remember)));
  }

  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword
    }).pipe(tap(response => this.storeSession(response)));
  }

  logout(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  changePassword(currentPassword: string, password: string, passwordConfirmation: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/password`, {
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation
    });
  }

  deleteAccount(password: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/account`, {
      body: { password }
    }).pipe(tap(() => this.clearSession()));
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get user(): AuthResponse['user'] | null {
    const storedUser = localStorage.getItem('jobtrack_user');

    return storedUser ? JSON.parse(storedUser) : null;
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem('jobtrack_user');
  }

  private storeSession(response: AuthResponse, remember = true): void {
    const storage = remember ? localStorage : sessionStorage;

    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    storage.setItem(this.tokenKey, response.token);
    localStorage.setItem('jobtrack_user', JSON.stringify(response.user));
  }
}
