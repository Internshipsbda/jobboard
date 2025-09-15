import { Job } from '../types/Job';

export const initialJobs: Job[] = [
  {
    id: 1,
    company: "Wallace Analytics",
    logo: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    title: "Data Analytics Intern",
    location: "New York, NY",
    industry: "Analytics",
    isPaid: true,
    skills: ["Excel", "Python", "Data Visualization"],
    description: "Join our data analytics team to work on cutting-edge projects involving large datasets and business intelligence solutions.",
    requirements: [
      "Currently enrolled in Computer Science, Statistics, or related field",
      "Basic knowledge of Python and Excel",
      "Strong analytical and problem-solving skills",
      "Excellent communication skills"
    ],
    benefits: [
      "Competitive stipend",
      "Mentorship program",
      "Networking opportunities",
      "Certificate of completion"
    ],
    applicationDeadline: "2024-12-31",
    contactEmail: "internships@wallaceanalytics.com",
    companyWebsite: "https://wallaceanalytics.com",
    duration: "3 months",
    startDate: "2024-06-01"
  },
  {
    id: 2,
    company: "TechFlow Solutions",
    logo: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    title: "Software Engineering Intern",
    location: "San Francisco, CA",
    industry: "Technology",
    isPaid: true,
    skills: ["Java", "Agile", "Debugging"],
    description: "Work alongside experienced developers on real-world software projects using modern technologies and agile methodologies.",
    requirements: [
      "Computer Science or Software Engineering student",
      "Proficiency in Java or similar programming language",
      "Understanding of software development lifecycle",
      "Team collaboration skills"
    ],
    benefits: [
      "Housing allowance",
      "Full-time offer potential",
      "Tech conference attendance",
      "Free lunch and snacks"
    ],
    applicationDeadline: "2024-11-30",
    contactEmail: "careers@techflow.com",
    companyWebsite: "https://techflow.com",
    duration: "4 months",
    startDate: "2024-05-15"
  },
  {
    id: 3,
    company: "Fabrican Inc.",
    logo: "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    title: "Accounting Intern",
    location: "Remote",
    industry: "Finance",
    isPaid: false,
    skills: ["Financial Analysis", "QuickBooks"],
    description: "Gain hands-on experience in accounting and financial management while working with our distributed team.",
    requirements: [
      "Accounting or Finance major",
      "Basic understanding of accounting principles",
      "Proficiency in Excel and QuickBooks",
      "Self-motivated and organized"
    ],
    benefits: [
      "Flexible schedule",
      "Remote work experience",
      "Professional development",
      "Letter of recommendation"
    ],
    applicationDeadline: "2024-12-15",
    contactEmail: "hr@fabrican.com",
    companyWebsite: "https://fabrican.com",
    duration: "6 months",
    startDate: "2024-01-15"
  },
  {
    id: 4,
    company: "Creative Studio",
    logo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    title: "Graphic Design Intern",
    location: "Chicago, IL",
    industry: "Design",
    isPaid: false,
    skills: ["Canva", "Adobe Photoshop", "Illustration"],
    description: "Create compelling visual designs for various marketing materials and digital platforms.",
    requirements: [
      "Graphic Design or related field student",
      "Proficiency in Adobe Creative Suite",
      "Strong portfolio of design work",
      "Creative thinking and attention to detail"
    ],
    benefits: [
      "Portfolio building opportunity",
      "Industry mentorship",
      "Creative freedom",
      "Networking events"
    ],
    applicationDeadline: "2024-12-01",
    contactEmail: "design@creativestudio.com",
    companyWebsite: "https://creativestudio.com",
    duration: "3 months",
    startDate: "2024-02-01"
  }
];