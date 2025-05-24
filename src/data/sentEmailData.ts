
import { EmailData } from '../types/email';

export const sentEmails: EmailData[] = [
  {
    id: "sent_001",
    subject: "Re: Insurance Coverage Questions - Documents Attached",
    sender: {
      name: "Sarah Johnson",
      email: "sarah.johnson@family.com",
      organization: "Johnson Family"
    },
    recipient: "Medicare Support <support@medicare.gov>",
    content: "Hello,\n\nThank you for your email regarding our insurance coverage questions. I've attached the requested documentation:\n\n1. Insurance Questions Response - Our detailed responses to your questionnaire\n2. Updated Emergency Contacts - Current emergency contact information\n\nPlease let me know if you need any additional information.\n\nBest regards,\nSarah Johnson",
    date: "2024-11-18T14:30:00Z",
    read: true,
    replied: false,
    responseReceived: true,
    private: false,
    category: "insurance",
    cc: ["michael.johnson@family.com"],
    bcc: []
  },
  {
    id: "sent_002", 
    subject: "Family Medical History Documentation",
    sender: {
      name: "Michael Johnson",
      email: "michael.johnson@family.com",
      organization: "Johnson Family"
    },
    recipient: "Dr. Patricia Williams <dr.williams@citymedical.com>",
    content: "Dear Dr. Williams,\n\nAs requested during our last appointment, I've compiled our complete family medical history in the attached spreadsheet. This includes:\n\n- Three generations of medical history\n- Current medications and allergies\n- Previous surgeries and major medical events\n- Genetic conditions and risk factors\n\nPlease review this information before our next consultation on December 5th.\n\nThank you,\nMichael Johnson",
    date: "2024-11-15T09:45:00Z", 
    read: true,
    replied: false,
    responseReceived: false,
    private: false,
    category: "medical",
    cc: [],
    bcc: []
  },
  {
    id: "sent_003",
    subject: "Care Preferences and Weekly Schedule",
    sender: {
      name: "Sarah Johnson", 
      email: "sarah.johnson@family.com",
      organization: "Johnson Family"
    },
    recipient: "Susan Martinez <s.martinez@sunnymeadows.com>",
    content: "Hi Susan,\n\nI hope this email finds you well. As we discussed, I'm sending over the completed care preferences form along with a photo of Dad's current weekly schedule that works well for him.\n\nThe care preferences form outlines:\n- Daily routine preferences\n- Meal preferences and dietary restrictions  \n- Activity preferences\n- Communication preferences\n\nThe weekly schedule photo shows the current routine that he's comfortable with. Please let me know if you have any questions about implementing these preferences.\n\nLooking forward to hearing from you.\n\nWarm regards,\nSarah",
    date: "2024-11-12T16:20:00Z",
    read: true, 
    replied: false,
    responseReceived: true,
    private: false,
    category: "housing",
    cc: [],
    bcc: []
  }
];
