
import { getAllEmails } from '../data/emailData';
import { addAttachmentsToEmails } from '../data/emailDataWithAttachments';
import { EmailData } from '../types/email';

export const getAllEmailsWithAttachments = (): EmailData[] => {
  const emails = getAllEmails();
  return addAttachmentsToEmails(emails);
};

export const getEmailByIdWithAttachments = (id: string): EmailData | undefined => {
  const emails = getAllEmailsWithAttachments();
  return emails.find(email => email.id === id);
};
