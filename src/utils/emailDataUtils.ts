
import { getAllEmails } from '../data/emailData';
import { addAttachmentsToEmails } from '../data/emailDataWithAttachments';
import { EmailData } from '../types/email';

export const getAllEmailsWithAttachments = (): EmailData[] => {
  const emails = getAllEmails();
  console.log('Base emails loaded:', emails.length);
  
  const emailsWithAttachments = addAttachmentsToEmails(emails);
  console.log('Emails with attachments processed:', emailsWithAttachments.length);
  
  const emailsWithActualAttachments = emailsWithAttachments.filter(email => email.attachments && email.attachments.length > 0);
  console.log('Emails that have attachments:', emailsWithActualAttachments.length);
  
  return emailsWithAttachments;
};

export const getEmailByIdWithAttachments = (id: string): EmailData | undefined => {
  const emails = getAllEmailsWithAttachments();
  return emails.find(email => email.id === id);
};
