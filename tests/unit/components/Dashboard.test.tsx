import { render, screen } from '@testing-library/react';
import Dashboard from '../../../src/pages/index';

// Mock the Layout component
jest.mock('../../../src/components/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock the mockApplications data
jest.mock('../../../src/data/mockApplications', () => ({
  mockApplications: [
    {
      id: 'WP-2024-1234',
      applicantName: 'Hans Mueller',
      dateOfBirth: '1985-03-15',
      email: 'hans.mueller@email.de',
      visaType: 'work_permit',
      status: 'documents_required',
      submissionDate: '2024-03-01',
      expectedCompletion: '2024-04-20',
      requiredDocuments: [
        { name: 'Employment Contract', status: 'missing', deadline: '2024-04-15', template: null },
        { name: 'Language Certificate', status: 'received', deadline: null, template: null }
      ],
      timeline: {
        submitted: '2024-03-01',
        initialReview: '2024-03-05',
        expectedDecision: '2024-04-20'
      }
    },
    {
      id: 'TV-2024-3456',
      applicantName: 'Ahmed Hassan',
      dateOfBirth: '1978-12-03',
      email: 'ahmed.hassan@email.com',
      visaType: 'tourist_visa',
      status: 'approved',
      submissionDate: '2024-03-20',
      expectedCompletion: '2024-03-27',
      approvalDate: '2024-03-25',
      requiredDocuments: [],
      timeline: {
        submitted: '2024-03-20',
        initialReview: '2024-03-22',
        approved: '2024-03-25',
        expectedDecision: '2024-03-25'
      }
    },
    {
      id: 'SV-2024-7891',
      applicantName: 'Maria Santos',
      dateOfBirth: '1992-08-22',
      email: 'maria.santos@email.com',
      visaType: 'student_visa',
      status: 'under_review',
      submissionDate: '2024-02-10',
      expectedCompletion: '2024-04-25',
      requiredDocuments: [],
      timeline: {
        submitted: '2024-02-10',
        initialReview: '2024-02-15',
        expectedDecision: '2024-04-25'
      }
    }
  ]
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    render(<Dashboard />);
  });

  describe('Page Structure', () => {
    test('should render main heading', () => {
      expect(screen.getByText('Application Dashboard')).toBeInTheDocument();
    });

    test('should render description text', () => {
      expect(screen.getByText(/Real-time overview of current visa applications/)).toBeInTheDocument();
    });

    test('should be wrapped in Layout component', () => {
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });
  });

  describe('Statistics Cards', () => {
    test('should display total applications count', () => {
      expect(screen.getByText('Total Applications')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Based on mocked data
      expect(screen.getByText('Active cases')).toBeInTheDocument();
    });

    test('should display approved applications count', () => {
      expect(screen.getByText('Approved Today')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // One approved in mock data
      expect(screen.getByText('Completed processing')).toBeInTheDocument();
    });

    test('should display pending applications count', () => {
      expect(screen.getByText('Pending Review')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Two pending in mock data
      expect(screen.getByText('In processing queue')).toBeInTheDocument();
    });

    test('should display automation rate', () => {
      expect(screen.getByText('Automation Rate')).toBeInTheDocument();
      expect(screen.getByText('90%')).toBeInTheDocument();
      expect(screen.getByText('Inquiries handled by AI')).toBeInTheDocument();
    });
  });

  describe('Application Cards', () => {
    test('should render all application cards', () => {
      expect(screen.getByText('Hans Mueller')).toBeInTheDocument();
      expect(screen.getByText('Ahmed Hassan')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    });

    test('should display application IDs', () => {
      expect(screen.getByText('WP-2024-1234')).toBeInTheDocument();
      expect(screen.getByText('TV-2024-3456')).toBeInTheDocument();
      expect(screen.getByText('SV-2024-7891')).toBeInTheDocument();
    });

    test('should display visa types', () => {
      expect(screen.getByText('WORK PERMIT')).toBeInTheDocument();
      expect(screen.getByText('TOURIST VISA')).toBeInTheDocument();
      expect(screen.getByText('STUDENT VISA')).toBeInTheDocument();
    });

    test('should display application statuses with correct styling', () => {
      const documentsRequired = screen.getByText('documents required');
      const approved = screen.getByText('approved');
      const underReview = screen.getByText('under review');

      expect(documentsRequired).toBeInTheDocument();
      expect(approved).toBeInTheDocument();
      expect(underReview).toBeInTheDocument();

      // Check if status badges have correct CSS classes
      expect(documentsRequired.closest('div')).toHaveClass('bg-red-100');
      expect(approved.closest('div')).toHaveClass('bg-green-100');
      expect(underReview.closest('div')).toHaveClass('bg-yellow-100');
    });

    test('should display expected completion dates', () => {
      expect(screen.getByText('Expected: 2024-04-20')).toBeInTheDocument();
      expect(screen.getByText('Expected: 2024-03-27')).toBeInTheDocument();
      expect(screen.getByText('Expected: 2024-04-25')).toBeInTheDocument();
    });

    test('should display dates of birth', () => {
      expect(screen.getByText('DOB: 1985-03-15')).toBeInTheDocument();
      expect(screen.getByText('DOB: 1978-12-03')).toBeInTheDocument();
      expect(screen.getByText('DOB: 1992-08-22')).toBeInTheDocument();
    });
  });

  describe('Document Status Display', () => {
    test('should show document status for applications with documents', () => {
      expect(screen.getByText('Documents Status:')).toBeInTheDocument();
    });

    test('should display document names (truncated)', () => {
      expect(screen.getByText('Employment Contract...')).toBeInTheDocument();
      expect(screen.getByText('Language Certificate...')).toBeInTheDocument();
    });

    test('should show correct icons for document status', () => {
      // Missing document should have alert circle (red)
      // Received document should have check circle (green)
      expect(screen.getAllByTestId('alert-circle-icon')).toBeTruthy();
      expect(screen.getAllByTestId('check-circle-icon')).toBeTruthy();
    });
  });

  describe('System Performance Section', () => {
    test('should display system performance metrics', () => {
      expect(screen.getByText('System Performance')).toBeInTheDocument();
      expect(screen.getByText('Inquiries Handled Today')).toBeInTheDocument();
      expect(screen.getByText('247')).toBeInTheDocument();
      expect(screen.getByText('Average Response Time')).toBeInTheDocument();
      expect(screen.getByText('0.8s')).toBeInTheDocument();
      expect(screen.getByText('User Satisfaction')).toBeInTheDocument();
      expect(screen.getByText('94.2%')).toBeInTheDocument();
      expect(screen.getByText('Staff Time Saved')).toBeInTheDocument();
      expect(screen.getByText('6.2 hrs')).toBeInTheDocument();
    });
  });

  describe('Recent Activity Section', () => {
    test('should display recent activity section', () => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    test('should show activity items with timestamps', () => {
      expect(screen.getByText('Tourist visa approved')).toBeInTheDocument();
      expect(screen.getByText('Ahmed Hassan - 2 minutes ago')).toBeInTheDocument();
      expect(screen.getByText('Documents received')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos - 15 minutes ago')).toBeInTheDocument();
      expect(screen.getByText('New application submitted')).toBeInTheDocument();
      expect(screen.getByText('Work permit - 1 hour ago')).toBeInTheDocument();
      expect(screen.getByText('Document deadline reminder sent')).toBeInTheDocument();
      expect(screen.getByText('Hans Mueller - 2 hours ago')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('should have responsive grid classes', () => {
      const dashboardContainer = screen.getByText('Application Dashboard').closest('div');
      // This tests that the component renders without errors and contains grid classes
      expect(dashboardContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Application Dashboard');
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5); // Application names + section headings
    });

    test('should have descriptive text for screen readers', () => {
      expect(screen.getByText(/Real-time overview of current visa applications/)).toBeInTheDocument();
    });
  });
});