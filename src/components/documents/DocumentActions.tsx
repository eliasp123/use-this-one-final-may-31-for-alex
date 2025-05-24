
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

interface DocumentActionsProps {
  emailId: string;
  badgeColor: string;
  layout?: 'grid' | 'list';
}

const DocumentActions = ({ emailId, badgeColor, layout = 'grid' }: DocumentActionsProps) => {
  const navigate = useNavigate();

  if (layout === 'grid') {
    return (
      <div className="flex gap-2 mt-auto">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/email/${emailId}`)}
          className="flex-1 text-xs h-8 px-3 border-gray-300 hover:bg-gray-50 font-medium"
        >
          View Email
        </Button>
        <Button
          size="sm"
          className={`${badgeColor} hover:opacity-90 flex-1 text-xs h-8 px-3 font-medium`}
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate(`/email/${emailId}`)}
      >
        View Email
      </Button>
      <Button
        size="sm"
        className={`${badgeColor} hover:opacity-90`}
      >
        <Download className="h-4 w-4 mr-1" />
        Download
      </Button>
    </div>
  );
};

export default DocumentActions;
