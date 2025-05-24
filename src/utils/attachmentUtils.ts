import { getAllEmailsWithAttachments } from './emailDataUtils';
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
  const emails = getAllEmailsWithAttachments();
  console.log('Total emails with potential attachments:', emails.length);
  
  const attachments: AttachmentWithContext[] = [];

  emails.forEach(email => {
    console.log(`Email ${email.id}: ${email.attachments ? email.attachments.length : 0} attachments`);
    if (email.attachments && email.attachments.length > 0) {
      email.attachments.forEach(attachment => {
        console.log(`Adding attachment: ${attachment.name} from email ${email.id}`);
        
        // Determine direction based on email ID - sent emails have IDs starting with 'sent_'
        const direction = email.id.startsWith('sent_') ? 'sent' : 'received';
        
        attachments.push({
          ...attachment,
          emailId: email.id,
          emailSubject: email.subject,
          senderName: email.sender.name,
          senderOrganization: email.sender.organization,
          emailDate: email.date,
          direction: direction
        });
      });
    }
  });

  console.log('Total attachments found:', attachments.length);
  console.log('Attachments:', attachments.map(a => `${a.name} (${a.direction})`));
  
  return attachments.sort((a, b) => new Date(b.emailDate).getTime() - new Date(a.emailDate).getTime());
};

// Helper function to categorize file types with priority order
const categorizeFileType = (type: string): 'documents' | 'images' | 'spreadsheets' | 'other' => {
  // Images first (highest priority)
  if (type.startsWith('image/')) {
    return 'images';
  }
  
  // Spreadsheets second
  if (type.includes('sheet') || type.includes('csv') || type.includes('excel')) {
    return 'spreadsheets';
  }
  
  // Documents third
  if (type.includes('pdf') || type.includes('document') || type.includes('text') || type === 'application/msword') {
    return 'documents';
  }
  
  // Everything else
  return 'other';
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
    
    const category = categorizeFileType(attachment.type);
    return category === selectedFilter;
  });
};

export const getAttachmentStats = (attachments: AttachmentWithContext[]) => {
  const total = attachments.length;
  let documents = 0;
  let images = 0;
  let spreadsheets = 0;
  let other = 0;

  // Categorize each attachment exactly once
  attachments.forEach(attachment => {
    const category = categorizeFileType(attachment.type);
    switch (category) {
      case 'documents':
        documents++;
        break;
      case 'images':
        images++;
        break;
      case 'spreadsheets':
        spreadsheets++;
        break;
      case 'other':
        other++;
        break;
    }
  });

  console.log('Attachment stats:', { total, documents, images, spreadsheets, other });
  console.log('Verification total:', documents + images + spreadsheets + other);
  console.log('Should match total:', total);

  return { total, documents, images, spreadsheets, other };
};
