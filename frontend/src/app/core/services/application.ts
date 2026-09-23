import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}

interface ApplicationListResponse {
  success: boolean;
  data: ApplicationApiData[];
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
      notes: data.notes
    };
  }

  getApplications(): Observable<Application[]> {

    return this.http
      .get<ApplicationListResponse>(
        this.apiUrl
      )
      .pipe(
        map(response =>
          response.data.map(
            application =>
              this.mapApplication(application)
          )
        )
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
}