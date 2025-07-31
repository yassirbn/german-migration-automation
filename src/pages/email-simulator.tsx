import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Mail, Download, Eye, Send } from "lucide-react";
import { mockApplications, Application } from "../data/mockApplications";

const EmailSimulatorPage = () => {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [emailType, setEmailType] = useState<"status_update" | "document_request">("status_update");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const emailTypes = [
    { value: "status_update", label: "Status Update" },
    { value: "document_request", label: "Document Request" },
    { value: "approval_notification", label: "Approval Notification" },
    { value: "appointment_confirmation", label: "Appointment Confirmation" },
    { value: "rejection_notice", label: "Rejection Notice" },
    { value: "reminder_notice", label: "Reminder Notice" },
  ];

  const generateEmail = () => {
    if (!selectedApplication) return;

    const templates = {
      status_update: generateStatusUpdateEmail,
      document_request: generateDocumentRequestEmail,
      approval_notification: generateApprovalEmail,
      appointment_confirmation: generateAppointmentEmail,
      rejection_notice: generateRejectionEmail,
      reminder_notice: generateReminderEmail,
    };

    const emailContent = templates[emailType](selectedApplication);
    setGeneratedEmail(emailContent);
  };

  const generateStatusUpdateEmail = (app: Application): string => {
    const status = app.status;
    const visaType = app.visaType.replace("_", " ").toUpperCase();

    switch (status) {
      case "documents_required":
        return `Subject: ${visaType} Application - Additional Documents Required

Dear ${app.applicantName},

Your ${visaType.toLowerCase()} application (ID: ${
          app.id
        }) has been reviewed, and we require additional documents to proceed.

**Required Documents:**
${app.requiredDocuments
  .filter((doc) => doc?.status === "missing")
  .map((doc) => `• ${doc?.name} (Deadline: ${doc?.deadline})`)
  .join("\n")}

**Important Notes:**
- Please submit all documents by the deadline to avoid delays
- Documents can be uploaded through our online portal or mailed to our office
- Incomplete applications will be delayed by 2-4 additional weeks

**Already Received:**
${app.requiredDocuments
  .filter((doc) => doc?.status === "received")
  .map((doc) => `✓ ${doc?.name}`)
  .join("\n")}

For document templates and submission guidelines, visit: www.germany.diplo.de/visa-documents

Best regards,
German Foreign Office
Visa Processing Department`;

      case "under_review":
        return `Subject: ${visaType} Application - Processing Update

Dear ${app.applicantName},

Your ${visaType.toLowerCase()} application (ID: ${
          app.id
        }) is currently under review.

**Current Status:** Extended Review in Progress
**Reason:** Verification of credentials with international authorities
**Expected Completion:** ${app.expectedCompletion}

**No Action Required:** Your application is progressing normally. We will contact you immediately once a decision is reached.

**Processing Timeline:**
• Application Submitted: ${app.timeline.submitted}
• Initial Review Completed: ${app.timeline.initialReview}
• Extended Review Started: ${app.timeline.underExtendedReview || "In Progress"}
• Expected Decision: ${app.expectedCompletion}

If you have urgent questions, please reply with "URGENT" in the subject line.

Best regards,
German Foreign Office
Visa Processing Department`;

      default:
        return `Subject: ${visaType} Application - Status Update

Dear ${app.applicantName},

Your ${visaType.toLowerCase()} application (ID: ${
          app.id
        }) status has been updated.

Current Status: ${status.replace("_", " ").toUpperCase()}
Expected Completion: ${app.expectedCompletion}

We will notify you of any further updates.

Best regards,
German Foreign Office`;
    }
  };

  const generateDocumentRequestEmail = (app: Application): string => {
    const missingDocs = app.requiredDocuments.filter(
      (doc) => doc?.status === "missing"
    );

    return `Subject: URGENT - Missing Documents for Application ${app.id}

Dear ${app.applicantName},

We have identified missing documents in your ${app.visaType.replace(
      "_",
      " "
    )} application that require immediate attention.

**MISSING DOCUMENTS:**
${missingDocs
  .map(
    (doc, index) =>
      `${index + 1}. ${doc?.name}
   - Deadline: ${doc?.deadline}
   - Template: ${doc?.template || "Available at our website"}`
  )
  .join("\n\n")}

**SUBMISSION METHODS:**
1. Online Portal: www.germany.diplo.de/upload
2. Email: documents-${app.id}@germany.gov
3. Mail: German Foreign Office, Visa Department, 10117 Berlin

**IMPORTANT:**
- Late submissions will delay your application by 2-4 weeks
- All documents must be certified translations if not in German or English
- Contact us immediately if you cannot meet the deadline

For questions, call: +49 (0) 30 1817 0

Best regards,
German Foreign Office
Document Processing Team`;
  };

  const generateApprovalEmail = (app: Application): string => {
    return `Subject: APPROVED - Your ${app.visaType
      .replace("_", " ")
      .toUpperCase()} Application

Dear ${app.applicantName},

Congratulations! We are pleased to inform you that your ${app.visaType.replace(
      "_",
      " "
    )} application has been APPROVED.

**Application Details:**
• Application ID: ${app.id}
• Visa Type: ${app.visaType.replace("_", " ").toUpperCase()}
• Approval Date: ${app.approvalDate || new Date().toISOString().split("T")[0]}
• Valid From: ${new Date().toISOString().split("T")[0]}
• Valid Until: ${
      app.visaType === "tourist_visa" ? "90 days" : "1 year (renewable)"
    }

**NEXT STEPS:**
1. Your passport with visa will be mailed within 5-7 business days
2. Track delivery at: www.dhl.de using tracking number (sent separately)
3. For urgent travel, collect passport from our office starting tomorrow

**COLLECTION HOURS:**
Monday-Friday: 8:00-16:00
Address: German Foreign Office, Werderscher Markt 1, 10117 Berlin

**IMPORTANT REMINDERS:**
• Check all visa details upon receipt
• Ensure passport validity exceeds visa duration
• Register with local authorities within 14 days of arrival

Welcome to Germany!

Best regards,
German Foreign Office
Visa Approval Department`;
  };

  const generateAppointmentEmail = (app: Application): string => {
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 7);

    return `Subject: Appointment Confirmation - Application ${app.id}

Dear ${app.applicantName},

Your appointment has been scheduled for your ${app.visaType.replace(
      "_",
      " "
    )} application.

**APPOINTMENT DETAILS:**
• Date: ${appointmentDate.toLocaleDateString("de-DE")}
• Time: 10:30 AM
• Duration: 30 minutes
• Location: German Foreign Office, Room 204
• Address: Werderscher Markt 1, 10117 Berlin

**PLEASE BRING:**
• Original passport
• Application confirmation (${app.id})
• All supporting documents
• Appointment confirmation (this email)

**ARRIVAL INSTRUCTIONS:**
• Arrive 15 minutes early
• Security check required - no large bags
• Parking available at Hackescher Markt

**RESCHEDULE/CANCEL:**
• Online: www.germany.diplo.de/appointments
• Phone: +49 (0) 30 1817 0
• Email: appointments@germany.gov

If you cannot attend, please reschedule at least 24 hours in advance.

Best regards,
German Foreign Office
Appointment Coordination`;
  };

  const generateRejectionEmail = (app: Application): string => {
    return `Subject: Application Decision - ${app.visaType
      .replace("_", " ")
      .toUpperCase()} ${app.id}

Dear ${app.applicantName},

After careful review of your ${app.visaType.replace(
      "_",
      " "
    )} application (ID: ${
      app.id
    }), we regret to inform you that your application has been declined.

**Reason for Decision:**
Your application does not meet the requirements under Section 6 of the Residence Act due to insufficient financial documentation.

**Right to Appeal:**
You have the right to appeal this decision within one month of receiving this notification. Submit your appeal to:

German Foreign Office
Appeals Department
Werderscher Markt 1
10117 Berlin

**Reapplication:**
You may submit a new application at any time, addressing the issues mentioned above. New application fee will apply.

**Required for Reapplication:**
• Updated financial proof showing €10,332 minimum
• Bank statements from the last 6 months
• Additional guarantor documentation

For questions about this decision, contact us at appeals@germany.gov

Best regards,
German Foreign Office
Visa Decision Department`;
  };

  const generateReminderEmail = (app: Application): string => {
    const missingDocs = app.requiredDocuments.filter(
      (doc) => doc?.status === "missing"
    );

    return `Subject: REMINDER - Document Deadline Approaching - Application ${
      app.id
    }

Dear ${app.applicantName},

This is a friendly reminder that the deadline for submitting required documents for your ${app.visaType.replace(
      "_",
      " "
    )} application is approaching.

**URGENT - Missing Documents:**
${missingDocs
  .map((doc) => `• ${doc?.name} - Deadline: ${doc?.deadline}`)
  .join("\n")}

**Days Remaining:** 3 days until deadline

**Quick Submission Options:**
• Online Upload: www.germany.diplo.de/upload (Fastest)
• Email: documents-${app.id}@germany.gov
• Express Mail: German Foreign Office, 10117 Berlin

**After Deadline:**
- Processing will be delayed by 2-4 weeks
- You may need to resubmit your entire application
- Additional fees may apply

**Need Help?**
• Live Chat: www.germany.diplo.de/chat
• Phone: +49 (0) 30 1817 0 (Mon-Fri, 9-17)
• Email: support@germany.gov

Don't let your application be delayed - submit today!

Best regards,
German Foreign Office
Document Processing Team`;
  };

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Auto-Response Simulator
          </h2>
          <p className="text-gray-600 mb-6">
            Generate automated email templates based on application status
            changes and user actions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Mail className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-800">
                  Email Configuration
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Application
                  </label>
                  <select
                    value={selectedApplication?.id || ""}
                    onChange={(e) => {
                      const app = mockApplications.find(
                        (a) => a.id === e.target.value
                      );
                      setSelectedApplication(app || null);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose an application...</option>
                    {mockApplications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.applicantName} - {app.visaType.replace("_", " ")} (
                        {app.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Type
                  </label>
                  <select
                    value={emailType}
                    onChange={(e) => setEmailType(e.target.value as any )}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {emailTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={generateEmail}
                  disabled={!selectedApplication}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Generate Email Template
                </button>

                {generatedEmail && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => setIsPreview(!isPreview)}
                      className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 flex items-center justify-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {isPreview ? "Edit" : "Preview"}
                    </button>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(generatedEmail)
                      }
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 flex items-center justify-center text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Copy
                    </button>
                  </div>
                )}
              </div>

              {/* Application Summary */}
              {selectedApplication && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Application Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {selectedApplication.applicantName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {selectedApplication.visaType.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-medium ${
                          selectedApplication.status === "approved"
                            ? "text-green-600"
                            : selectedApplication.status === "under_review"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedApplication.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected:</span>
                      <span className="font-medium">
                        {selectedApplication.expectedCompletion}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Preview/Editor */}
          <div className="lg:col-span-2">
            {generatedEmail ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800">
                    {isPreview ? "Email Preview" : "Generated Email Template"}
                  </h4>
                  <div className="flex space-x-2">
                    <span className="text-sm text-gray-500">
                      {emailTypes.find((t) => t.value === emailType)?.label}
                    </span>
                  </div>
                </div>

                {isPreview ? (
                  <div className="p-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>From:</strong> noreply@germany.gov
                        <br />
                        <strong>To:</strong> {selectedApplication?.email}
                        <br />
                        <strong>Subject:</strong>{" "}
                        {generatedEmail.split("\n")[0].replace("Subject: ", "")}
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {generatedEmail.split("\n").slice(2).join("\n")}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={generatedEmail}
                    onChange={(e) => setGeneratedEmail(e.target.value)}
                    className="w-full h-96 p-4 border-0 focus:outline-none focus:ring-0 text-sm font-mono resize-none"
                    placeholder="Generated email will appear here..."
                  />
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Email Generated
                </h3>
                <p className="text-gray-600">
                  Select an application and email type, then click "Generate
                  Email Template" to see the automated email.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmailSimulatorPage;
