
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
    }
  ],
  "5e6f7g8h": [
    {
      id: "att_003",
      name: "Facility_Tour_Photos.jpg",
      size: 2048000,
      type: "image/jpeg",
      url: "/documents/facility-photos.jpg"
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
    }
  ],
  "3m4n5o6p": [
    {
      id: "att_006",
      name: "VA_Benefits_Application.pdf",
      size: 896000,
      type: "application/pdf",
      url: "/documents/va-benefits-app.pdf"
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
    }
  ],
  "1u2v3w4x": [
    {
      id: "att_009",
      name: "Home_Care_Contract.pdf",
      size: 1792000,
      type: "application/pdf",
      url: "/documents/home-care-contract.pdf"
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
