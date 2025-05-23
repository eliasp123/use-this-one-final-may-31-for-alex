
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, Mail } from 'lucide-react';

const DocumentsHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/')}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate('/emails/all/all')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            size="sm"
          >
            <Mail className="mr-2 h-4 w-4" />
            Back to Conversations
          </Button>
        </div>
      </div>

      {/* Centered Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-700 mb-2">Documents Dashboard</h1>
        <p className="text-gray-500">Manage all your email attachments in one place</p>
      </div>
    </>
  );
};

export default DocumentsHeader;
