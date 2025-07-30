export interface Document {
  name: string;
  status: 'missing' | 'received';
  deadline: string | null;
  template: string | null;
}

export interface Timeline {
  submitted: string;
  initialReview: string;
  documentsRequested?: string;
  underExtendedReview?: string;
  approved?: string;
  expectedDecision: string;
}

export interface Application {
  id: string;
  applicantName: string;
  dateOfBirth: string;
  email: string;
  visaType: 'work_permit' | 'student_visa' | 'tourist_visa' | 'family_reunification';
  status: 'documents_required' | 'under_review' | 'approved' | 'rejected';
  submissionDate: string;
  expectedCompletion: string;
  approvalDate?: string;
  requiredDocuments: Document[];
  timeline: Timeline;
}

export const mockApplications: Application[] = [
  {
    id: "WP-2024-1234",
    applicantName: "Hans Mueller",
    dateOfBirth: "1985-03-15",
    email: "hans.mueller@email.de",
    visaType: "work_permit",
    status: "documents_required",
    submissionDate: "2024-03-01",
    expectedCompletion: "2024-04-20",
    requiredDocuments: [
      {
        name: "Employment Contract with Salary Details",
        status: "missing",
        deadline: "2024-04-15",
        template: "employment_contract_template.pdf"
      },
      {
        name: "German Language Proficiency Certificate (B1)",
        status: "missing",
        deadline: "2024-04-15",
        template: "language_cert_requirements.pdf"
      },
      {
        name: "Passport Copy",
        status: "received",
        deadline: null,
        template: null
      }
    ],
    timeline: {
      submitted: "2024-03-01",
      initialReview: "2024-03-05",
      documentsRequested: "2024-03-10",
      expectedDecision: "2024-04-20"
    }
  },
  {
    id: "SV-2024-7891",
    applicantName: "Maria Santos",
    dateOfBirth: "1992-08-22",
    email: "maria.santos@email.com",
    visaType: "student_visa",
    status: "under_review",
    submissionDate: "2024-02-10",
    expectedCompletion: "2024-04-25",
    requiredDocuments: [
      {
        name: "University Acceptance Letter",
        status: "received",
        deadline: null,
        template: null
      },
      {
        name: "Financial Proof (€10,332 for one year)",
        status: "received",
        deadline: null,
        template: null
      },
      {
        name: "Health Insurance Confirmation",
        status: "received",
        deadline: null,
        template: null
      }
    ],
    timeline: {
      submitted: "2024-02-10",
      initialReview: "2024-02-15",
      underExtendedReview: "2024-03-01",
      expectedDecision: "2024-04-25"
    }
  },
  {
    id: "TV-2024-3456",
    applicantName: "Ahmed Hassan",
    dateOfBirth: "1978-12-03",
    email: "ahmed.hassan@email.com",
    visaType: "tourist_visa",
    status: "approved",
    submissionDate: "2024-03-20",
    expectedCompletion: "2024-03-27",
    approvalDate: "2024-03-25",
    requiredDocuments: [],
    timeline: {
      submitted: "2024-03-20",
      initialReview: "2024-03-22",
      approved: "2024-03-25",
      expectedDecision: "2024-03-25"
    }
  },
  {
    id: "FR-2024-5678",
    applicantName: "Elena Rossi",
    dateOfBirth: "1990-07-12",
    email: "elena.rossi@email.it",
    visaType: "family_reunification",
    status: "under_review",
    submissionDate: "2024-01-15",
    expectedCompletion: "2024-05-01",
    requiredDocuments: [
      {
        name: "Marriage Certificate (Certified Translation)",
        status: "received",
        deadline: null,
        template: null
      },
      {
        name: "Spouse's German Residence Permit",
        status: "received",
        deadline: null,
        template: null
      },
      {
        name: "Proof of Adequate Housing",
        status: "received",
        deadline: null,
        template: null
      }
    ],
    timeline: {
      submitted: "2024-01-15",
      initialReview: "2024-01-20",
      underExtendedReview: "2024-02-15",
      expectedDecision: "2024-05-01"
    }
  }
];

export const getApplicationById = (id: string): Application | undefined => {
  return mockApplications.find(app => app.id === id);
};

export const getApplicationByNameAndDob = (name: string, dob: string): Application | undefined => {
  return mockApplications.find(app => 
    app.applicantName.toLowerCase().includes(name.toLowerCase()) && 
    (app.dateOfBirth === dob || app.dateOfBirth.replace(/-/g, '.') === dob)
  );
};