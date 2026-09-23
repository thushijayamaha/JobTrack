export interface InterviewApplication {
  id: number;
  company_name: string;
  job_title: string;
}

export interface Interview {
  id: number;
  application_id: number;
  interview_date: string;
  interview_time: string;
  interview_type: 'Online' | 'On-site' | 'Phone';
  meeting_link?: string;
  interviewer_name?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;

  application?: InterviewApplication;
}