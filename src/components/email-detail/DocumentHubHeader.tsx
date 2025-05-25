
import React from 'react';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { FileText } from 'lucide-react';

const DocumentHubHeader: React.FC = () => {
  return (
    <DialogHeader className="pb-6">
      <DialogTitle className="flex items-center text-2xl font-semibold text-gray-800">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
          <FileText className="h-5 w-5 text-white" />
        </div>
        Document Hub
      </DialogTitle>
    </DialogHeader>
  );
};

export default DocumentHubHeader;
