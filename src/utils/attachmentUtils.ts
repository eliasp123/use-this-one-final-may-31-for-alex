
import { getAllEmails } from '../data/emailData';
import { EmailAttachment } from '../types/email';

export interface AttachmentWithContext extends EmailAttachment {
  emailId: string;
  emailSubject: string;
  senderName: string;
  senderOrganization: string;
  emailDate: string;
  direction: 'received' | 'sent';
}

export const getAllAttachments = (): AttachmentWithContext[] => {
  const emails = getAllEmails();
  const attachments: AttachmentWithContext[] = [];

  emails.forEach(email => {
    if (email.attachments && email.attachments.length > 0) {
      email.attachments.forEach(attachment => {
        attachments.push({
          ...attachment,
          emailId: email.id,
          emailSubject: email.subject,
          senderName: email.sender.name,
          senderOrganization: email.sender.organization,
          emailDate: email.date,
          direction: 'received'
        });
      });
    }
  });

  return attachments.sort((a, b) => new Date(b.emailDate).getTime() - new Date(a.emailDate).getTime());
};

export const filterAttachments = (
  attachments: AttachmentWithContext[],
  searchQuery: string,
  selectedFilter: 'all' | 'documents' | 'images' | 'spreadsheets' | 'other'
): AttachmentWithContext[] => {
  return attachments.filter(attachment => {
    const matchesSearch = attachment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attachment.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attachment.senderOrganization.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'documents') return attachment.type.includes('pdf') || attachment.type.includes('document') || attachment.type.includes('text');
    if (selectedFilter === 'images') return attachment.type.startsWith('image/');
    if (selectedFilter === 'spreadsheets') return attachment.type.includes('sheet') || attachment.type.includes('csv') || attachment.type.includes('excel');
    if (selectedFilter === 'other') return !attachment.type.startsWith('image/') && !attachment.type.includes('pdf') && !attachment.type.includes('document') && !attachment.type.includes('sheet') && !attachment.type.includes('csv');

    return true;
  });
};

export const getAttachmentStats = (attachments: AttachmentWithContext[]) => {
  const total = attachments.length;
  const documents = attachments.filter(a => a.type.includes('pdf') || a.type.includes('document')).length;
  const images = attachments.filter(a => a.type.startsWith('image/')).length;
  const spreadsheets = attachments.filter(a => a.type.includes('sheet') || a.type.includes('csv')).length;
  const other = total - documents - images - spreadsheets;

  return { total, documents, images, spreadsheets, other };
};
