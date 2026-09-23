export interface Application {
  id: number;
  companyName: string;
  jobTitle: string;
  jobType: string;
  applicationDate: string;
  status: string;
  jobUrl?: string;
  salary?: string;
  location?: string;
  notes?: string;
}