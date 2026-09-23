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
  resumePath?: string;
  statusHistory?: {
    id: number;
    from_status: string | null;
    to_status: string;
    created_at: string;
  }[];
}