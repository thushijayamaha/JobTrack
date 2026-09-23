import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Interview } from '../models/interview.model';

interface InterviewListResponse {
  success: boolean;
  data: Interview[];
}

interface InterviewResponse {
  success: boolean;
  message?: string;
  data: Interview;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  private readonly apiUrl =
    'http://127.0.0.1:8000/api/interviews';

  constructor(private http: HttpClient) {}

  // Get all interviews
  getInterviews(): Observable<Interview[]> {
    return this.http
      .get<InterviewListResponse>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  // Get one interview
  getInterviewById(id: number): Observable<Interview> {
    return this.http
      .get<InterviewResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Create interview
  addInterview(interview: Interview): Observable<Interview> {
    return this.http
      .post<InterviewResponse>(this.apiUrl, {
        application_id: interview.application_id,
        interview_date: interview.interview_date,
        interview_time: interview.interview_time,
        interview_type: interview.interview_type,
        meeting_link: interview.meeting_link,
        interviewer_name: interview.interviewer_name,
        status: interview.status,
        notes: interview.notes
      })
      .pipe(
        map(response => response.data)
      );
  }

  // Update interview
  updateInterview(
    id: number,
    interview: Interview
  ): Observable<Interview> {
    return this.http
      .put<InterviewResponse>(`${this.apiUrl}/${id}`, {
        interview_date: interview.interview_date,
        interview_time: interview.interview_time,
        interview_type: interview.interview_type,
        meeting_link: interview.meeting_link,
        interviewer_name: interview.interviewer_name,
        status: interview.status,
        notes: interview.notes
      })
      .pipe(
        map(response => response.data)
      );
  }

  // Delete interview
  deleteInterview(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}