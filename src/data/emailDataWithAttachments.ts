
import { EmailData } from '../types/email';
import { sampleAttachments } from './sampleAttachments';

// This extends the existing email data with attachments
export const addAttachmentsToEmails = (emails: EmailData[]): EmailData[] => {
  return emails.map(email => {
    const attachments = sampleAttachments[email.id];
    return {
      ...email,
      attachments: attachments || undefined
    };
  });
};
