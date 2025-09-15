export interface Job {
  id: number;
  company: string;
  logo: string;
  title: string;
  location: string;
  industry: string;
  isPaid: boolean;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  contactEmail: string;
  companyWebsite: string;
  duration: string;
  startDate: string;
}