import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Application } from '../models/application.model';

interface ApplicationApiData {
  id: number;
  company_name: string;
  job_title: string;
  job_type: string;
  application_date: string;
  status: string;
  job_url?: string;
  salary?: string;
  location?: string;
  notes?: string;
  resume_path?: string;
  status_history?: Application['statusHistory'];
  interviews?: Application['interviews'];
}

interface ApplicationListResponse {
  success: boolean;
  data: ApplicationApiData[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApplicationQuery {
  search?: string;
  status?: string;
  job_type?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface ApplicationPage {
  applications: Application[];
  currentPage: number;
  lastPage: number;
  total: number;
}

interface ApplicationResponse {
  success: boolean;
  message?: string;
  data: ApplicationApiData;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl =
    'http://127.0.0.1:8000/api/applications';

  constructor(
    private http: HttpClient
  ) {}

  private mapApplication(
    data: ApplicationApiData
  ): Application {

    return {
      id: data.id,
      companyName: data.company_name,
      jobTitle: data.job_title,
      jobType: data.job_type,
      applicationDate: data.application_date,
      status: data.status,
      jobUrl: data.job_url,
      salary: data.salary,
      location: data.location,
      notes: data.notes,
      resumePath: data.resume_path,
      statusHistory: data.status_history,
      interviews: data.interviews
    };
  }

  getApplications(query: ApplicationQuery = {}): Observable<ApplicationPage> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http
      .get<ApplicationListResponse>(
        this.apiUrl,
        { params }
      )
      .pipe(
        map(response => ({
          applications: response.data.map(application => this.mapApplication(application)),
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total
        }))
      );
  }

  getApplicationById(
    id: number
  ): Observable<Application> {

    return this.http
      .get<ApplicationResponse>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(response =>
          this.mapApplication(response.data)
        )
      );
  }

  addApplication(
    application: Application
  ): Observable<Application> {

    return this.http
      .post<ApplicationResponse>(
        this.apiUrl,
        {
          company_name:
            application.companyName,

          job_title:
            application.jobTitle,

          job_type:
            application.jobType,

          application_date:
            application.applicationDate,

          status:
            application.status,

          job_url:
            application.jobUrl,

          salary:
            application.salary,

          location:
            application.location,

          notes:
            application.notes
        }
      )
      .pipe(
        map(response =>
          this.mapApplication(response.data)
        )
      );
  }

  updateApplication(
    id: number,
    application: Application
  ): Observable<Application> {

    return this.http
      .put<ApplicationResponse>(
        `${this.apiUrl}/${id}`,
        {
          company_name:
            application.companyName,

          job_title:
            application.jobTitle,

          job_type:
            application.jobType,

          application_date:
            application.applicationDate,

          status:
            application.status,

          job_url:
            application.jobUrl,

          salary:
            application.salary,

          location:
            application.location,

          notes:
            application.notes
        }
      )
      .pipe(
        map(response =>
          this.mapApplication(response.data)
        )
      );
  }

  deleteApplication(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  uploadResume(id: number, file: File): Observable<Application> {
    const formData = new FormData();
    formData.append('resume', file);

    return this.http.post<ApplicationResponse>(`${this.apiUrl}/${id}/resume`, formData)
      .pipe(map(response => this.mapApplication(response.data)));
  }

  downloadResume(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/resume`, { responseType: 'blob' });
  }

  exportCsv(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/csv`, { responseType: 'blob' });
  }
}