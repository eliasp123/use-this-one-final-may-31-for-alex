
import { EmailAttachment } from '../types/email';

export const sampleAttachments: { [emailId: string]: EmailAttachment[] } = {
  "1a2b3c4d": [
    {
      id: "att_001",
      name: "Medicare_Benefits_Summary_2024.pdf",
      size: 1024000,
      type: "application/pdf",
      url: "/documents/medicare-benefits-2024.pdf"
    },
    {
      id: "att_002", 
      name: "Care_Plan_Updates.docx",
      size: 512000,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      url: "/documents/care-plan-updates.docx"
    },
    {
      id: "att_016",
      name: "Medical_History_Archive.zip",
      size: 3840000,
      type: "application/zip",
      url: "/documents/medical-history-archive.zip"
    }
  ],
  "5e6f7g8h": [
    {
      id: "att_003",
      name: "Facility_Tour_Photos.jpg",
      size: 2048000,
      type: "image/jpeg",
      url: "/documents/facility-photos.jpg"
    },
    {
      id: "att_014",
      name: "Healthcare_Expense_Tracking_2024.xlsx",
      size: 945000,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      url: "/documents/healthcare-expenses-2024.xlsx"
    }
  ],
  "9i0j1k2l": [
    {
      id: "att_004",
      name: "Insurance_Coverage_Spreadsheet.xlsx",
      size: 768000,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      url: "/documents/insurance-coverage.xlsx"
    },
    {
      id: "att_005",
      name: "Medical_Records_Summary.pdf",
      size: 1536000,
      type: "application/pdf", 
      url: "/documents/medical-records.pdf"
    },
    {
      id: "att_017",
      name: "CT_Scan_Results_2024.dcm",
      size: 4096000,
      type: "application/dicom",
      url: "/documents/ct-scan-results.dcm"
    }
  ],
  "3m4n5o6p": [
    {
      id: "att_006",
      name: "VA_Benefits_Application.pdf",
      size: 896000,
      type: "application/pdf",
      url: "/documents/va-benefits-app.pdf"
    },
    {
      id: "att_018",
      name: "Service_Records_Complete.pdf",
      size: 2550000,
      type: "application/pdf",
      url: "/documents/service-records.pdf"
    }
  ],
  "7q8r9s0t": [
    {
      id: "att_007",
      name: "Physical_Therapy_Schedule.docx",
      size: 384000,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      url: "/documents/pt-schedule.docx"
    },
    {
      id: "att_008",
      name: "Exercise_Progress_Chart.png",
      size: 1280000,
      type: "image/png",
      url: "/documents/exercise-chart.png"
    },
    {
      id: "att_019",
      name: "Recovery_Timeline_Infographic.svg",
      size: 620000,
      type: "image/svg+xml",
      url: "/documents/recovery-timeline.svg"
    }
  ],
  "1u2v3w4x": [
    {
      id: "att_009",
      name: "Home_Care_Contract.pdf",
      size: 1792000,
      type: "application/pdf",
      url: "/documents/home-care-contract.pdf"
    },
    {
      id: "att_015",
      name: "Family_Budget_Summary.xlsx",
      size: 672000,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      url: "/documents/family-budget-summary.xlsx"
    }
  ],
  "5y6z7a8b": [
    {
      id: "att_010",
      name: "Attorney_Consultation_Notes.txt",
      size: 128000,
      type: "text/plain",
      url: "/documents/attorney-notes.txt"
    },
    {
      id: "att_011",
      name: "Legal_Documents_Checklist.pdf",
      size: 640000,
      type: "application/pdf",
      url: "/documents/legal-checklist.pdf"
    },
    {
      id: "att_020",
      name: "Power_of_Attorney_Forms.pdf",
      size: 890000,
      type: "application/pdf",
      url: "/documents/power-of-attorney.pdf"
    }
  ],
  "kadiyi0yqc": [
    {
      id: "att_012",
      name: "Senior_Living_Brochure.pdf",
      size: 2048000,
      type: "application/pdf",
      url: "/documents/senior-living-brochure.pdf"
    },
    {
      id: "att_013",
      name: "Monthly_Activity_Schedule.docx",
      size: 512000,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      url: "/documents/activity-schedule.docx"
    }
  ]
};
