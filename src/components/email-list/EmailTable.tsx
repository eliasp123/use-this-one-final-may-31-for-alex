
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailData } from '@/types/email';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Paperclip } from 'lucide-react';

interface EmailTableProps {
  emails: EmailData[];
  formatDate: (dateString: string) => string;
}

const EmailTable: React.FC<EmailTableProps> = ({ emails, formatDate }) => {
  const navigate = useNavigate();

  const handleRowClick = (emailId: string) => {
    navigate(`/email/${emailId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Sender</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.length > 0 ? (
            emails.map((email) => (
              <TableRow 
                key={email.id} 
                className={`cursor-pointer hover:bg-gray-50 ${!email.read ? 'font-medium bg-blue-50/30' : ''}`}
                onClick={() => handleRowClick(email.id)}
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className={!email.read ? 'font-medium' : ''}>{email.sender.name}</span>
                      <span className="text-sm text-gray-500">{email.sender.organization}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className={!email.read ? 'font-medium' : ''}>{email.subject}</span>
                      {email.attachments && email.attachments.length > 0 && (
                        <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          <Paperclip className="w-3 h-3" />
                          <span>{email.attachments.length}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 truncate max-w-xs">
                      {email.content.substring(0, 60)}...
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-gray-500">{formatDate(email.date)}</TableCell>
                <TableCell className="text-center">
                  {!email.read ? (
                    <Badge className="bg-purple-500 hover:bg-purple-600">Unread</Badge>
                  ) : !email.replied ? (
                    <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
                  ) : !email.responseReceived ? (
                    <Badge className="bg-red-500 hover:bg-red-600">No Response</Badge>
                  ) : (
                    <Badge className="bg-green-500 hover:bg-green-600">Complete</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Mail className="h-8 w-8 mb-2 opacity-30" />
                  <p>No emails found</p>
                  <p className="text-sm">
                    {emails.length === 0 && window.location.search 
                      ? "Try changing your search terms" 
                      : "No emails match the selected filters"}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmailTable;
