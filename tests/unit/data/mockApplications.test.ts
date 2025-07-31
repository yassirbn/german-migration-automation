import { 
  mockApplications, 
  getApplicationById, 
  getApplicationByNameAndDob,
  Application 
} from '../../../src/data/mockApplications';

describe('Mock Applications Data', () => {
  describe('mockApplications array', () => {
    test('should contain exactly 4 applications', () => {
      expect(mockApplications).toHaveLength(4);
    });

    test('should have unique application IDs', () => {
      const ids = mockApplications.map(app => app.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have all required fields for each application', () => {
      mockApplications.forEach(app => {
        expect(app).toHaveProperty('id');
        expect(app).toHaveProperty('applicantName');
        expect(app).toHaveProperty('dateOfBirth');
        expect(app).toHaveProperty('email');
        expect(app).toHaveProperty('visaType');
        expect(app).toHaveProperty('status');
        expect(app).toHaveProperty('submissionDate');
        expect(app).toHaveProperty('expectedCompletion');
        expect(app).toHaveProperty('requiredDocuments');
        expect(app).toHaveProperty('timeline');
      });
    });

    test('should have valid visa types', () => {
      const validVisaTypes = ['work_permit', 'student_visa', 'tourist_visa', 'family_reunification'];
      mockApplications.forEach(app => {
        expect(validVisaTypes).toContain(app.visaType);
      });
    });

    test('should have valid statuses', () => {
      const validStatuses = ['documents_required', 'under_review', 'approved', 'rejected'];
      mockApplications.forEach(app => {
        expect(validStatuses).toContain(app.status);
      });
    });

    test('should have valid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      mockApplications.forEach(app => {
        expect(app.email).toMatch(emailRegex);
      });
    });

    test('should have valid date formats', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      mockApplications.forEach(app => {
        expect(app.dateOfBirth).toMatch(dateRegex);
        expect(app.submissionDate).toMatch(dateRegex);
        expect(app.expectedCompletion).toMatch(dateRegex);
      });
    });
  });

  describe('getApplicationById', () => {
    test('should return application when valid ID is provided', () => {
      const result = getApplicationById('WP-2024-1234');
      expect(result).toBeDefined();
      expect(result?.applicantName).toBe('Hans Mueller');
      expect(result?.visaType).toBe('work_permit');
    });

    test('should return application for all test IDs', () => {
      const testIds = ['WP-2024-1234', 'SV-2024-7891', 'TV-2024-3456', 'FR-2024-5678'];
      testIds.forEach(id => {
        const result = getApplicationById(id);
        expect(result).toBeDefined();
        expect(result?.id).toBe(id);
      });
    });

    test('should return undefined when invalid ID is provided', () => {
      const result = getApplicationById('INVALID-ID');
      expect(result).toBeUndefined();
    });

    test('should return undefined when empty string is provided', () => {
      const result = getApplicationById('');
      expect(result).toBeUndefined();
    });

    test('should be case sensitive', () => {
      const result = getApplicationById('wp-2024-1234');
      expect(result).toBeUndefined();
    });
  });

  describe('getApplicationByNameAndDob', () => {
    test('should return application when exact name and DOB are provided', () => {
      const result = getApplicationByNameAndDob('Hans Mueller', '1985-03-15');
      expect(result).toBeDefined();
      expect(result?.applicantName).toBe('Hans Mueller');
      expect(result?.dateOfBirth).toBe('1985-03-15');
    });

    test('should return application when partial name matches', () => {
      const result = getApplicationByNameAndDob('Hans', '1985-03-15');
      expect(result).toBeDefined();
      expect(result?.applicantName).toBe('Hans Mueller');
    });

    test('should be case insensitive for names', () => {
      const result = getApplicationByNameAndDob('hans mueller', '1985-03-15');
      expect(result).toBeDefined();
      expect(result?.applicantName).toBe('Hans Mueller');
    });

    test('should accept DOB in different formats', () => {
      const result1 = getApplicationByNameAndDob('Hans Mueller', '1985-03-15');
      const result2 = getApplicationByNameAndDob('Hans Mueller', '1985.03.15');
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1?.id).toBe(result2?.id);
    });

    test('should return undefined when name does not match', () => {
      const result = getApplicationByNameAndDob('John Doe', '1985-03-15');
      expect(result).toBeUndefined();
    });

    test('should return undefined when DOB does not match', () => {
      const result = getApplicationByNameAndDob('Hans Mueller', '1990-01-01');
      expect(result).toBeUndefined();
    });

    test('should work for all test applications', () => {
      const testCases = [
        { name: 'Hans Mueller', dob: '1985-03-15', expectedId: 'WP-2024-1234' },
        { name: 'Maria Santos', dob: '1992-08-22', expectedId: 'SV-2024-7891' },
        { name: 'Ahmed Hassan', dob: '1978-12-03', expectedId: 'TV-2024-3456' },
        { name: 'Elena Rossi', dob: '1990-07-12', expectedId: 'FR-2024-5678' },
      ];

      testCases.forEach(({ name, dob, expectedId }) => {
        const result = getApplicationByNameAndDob(name, dob);
        expect(result).toBeDefined();
        expect(result?.id).toBe(expectedId);
      });
    });
  });

  describe('Application data integrity', () => {
    test('Hans Mueller should have missing documents', () => {
      const hans = getApplicationById('WP-2024-1234');
      expect(hans?.status).toBe('documents_required');
      expect(hans?.requiredDocuments.some(doc => doc?.status === 'missing')).toBe(true);
    });

    test('Ahmed Hassan should be approved', () => {
      const ahmed = getApplicationById('TV-2024-3456');
      expect(ahmed?.status).toBe('approved');
      expect(ahmed?.approvalDate).toBeDefined();
    });

    test('Maria Santos should be under review', () => {
      const maria = getApplicationById('SV-2024-7891');
      expect(maria?.status).toBe('under_review');
      expect(maria?.timeline.underExtendedReview).toBeDefined();
    });

    test('each application should have proper timeline structure', () => {
      mockApplications.forEach(app => {
        expect(app.timeline).toHaveProperty('submitted');
        expect(app.timeline).toHaveProperty('initialReview');
        expect(app.timeline).toHaveProperty('expectedDecision');
        
        // Check chronological order
        const submitted = new Date(app.timeline.submitted);
        const initialReview = new Date(app.timeline.initialReview);
        const expectedDecision = new Date(app.timeline.expectedDecision);
        
        expect(initialReview.getTime()).toBeGreaterThanOrEqual(submitted.getTime());
        expect(expectedDecision.getTime()).toBeGreaterThanOrEqual(initialReview.getTime());
      });
    });
  });
});