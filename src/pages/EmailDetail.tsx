
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmailById } from '../data/emailData';
import { EmailData } from '../types/email';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Reply, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState<EmailData | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundEmail = getEmailById(id);
      if (foundEmail) {
        setEmail(foundEmail);
        
        // In a real app, we would mark it as read on the server
        // For this mock, we'll just update the local state
        if (!foundEmail.read) {
          foundEmail.read = true;
        }
      }
    }
  }, [id]);
  
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Email not found</h2>
          <p className="mb-4">The email you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }
  
  // Helper function to format date in a readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Determine status for display
  let statusBadge;
  if (!email.read) {
    statusBadge = <Badge className="bg-purple-500">Unread</Badge>;
  } else if (!email.replied) {
    statusBadge = <Badge className="bg-amber-500">Pending Reply</Badge>;
  } else if (!email.responseReceived) {
    statusBadge = <Badge className="bg-red-500">No Response Yet</Badge>;
  } else {
    statusBadge = <Badge className="bg-green-500">Completed</Badge>;
  }
  
  // In a real app, these functions would communicate with a backend
  const handleMarkAsReplied = () => {
    if (email) {
      email.replied = true;
      // Force a re-render
      setEmail({...email});
    }
  };
  
  const handleMarkAsResponseReceived = () => {
    if (email) {
      email.responseReceived = true;
      // Force a re-render
      setEmail({...email});
    }
  };

  // Categories with their display names and colors
  const categoryInfo: Record<string, { title: string, color: string, bgColor: string }> = {
    'senior-living': { 
      title: 'Senior Living', 
      color: 'bg-gradient-to-r from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50' 
    },
    'home-care': { 
      title: 'Home Care', 
      color: 'bg-gradient-to-r from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50' 
    },
    'federal-benefits': { 
      title: 'Federal Benefits', 
      color: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
      bgColor: 'bg-emerald-50' 
    },
    'local-government': { 
      title: 'Local Government', 
      color: 'bg-gradient-to-r from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50' 
    },
    'attorneys': { 
      title: 'Attorneys', 
      color: 'bg-gradient-to-r from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50' 
    },
    'other-professionals': { 
      title: 'Other Professionals', 
      color: 'bg-gradient-to-r from-indigo-400 to-indigo-500',
      bgColor: 'bg-indigo-50' 
    }
  };
  
  // Get info for current category
  const currentCategory = categoryInfo[email.category];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-light text-gray-800">
              {email.subject}
            </h1>
            
            <div className="flex items-center gap-2">
              {statusBadge}
              <div className={`px-3 py-1 rounded-lg ${currentCategory.bgColor} flex items-center`}>
                <span className={`w-2 h-2 rounded-full ${currentCategory.color.replace('bg-gradient-to-r', '')}`}></span>
                <span className="ml-2 text-xs font-medium text-gray-800">{currentCategory.title}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Email header info */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-medium">{email.sender.name}</h3>
                  <p className="text-gray-600">{email.sender.organization}</p>
                  <p className="text-sm text-gray-500">{email.sender.email}</p>
                </div>
                
                <p className="text-sm text-gray-500">
                  {formatDate(email.date)}
                </p>
              </div>
              <div className="text-sm text-gray-600">
                <span>To: {email.recipient}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Email content */}
            <div className="py-4 whitespace-pre-line text-gray-700">
              {email.content}
            </div>
          </CardContent>
        </Card>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-start">
          <Button className="bg-green-500 hover:bg-green-600">
            <Reply className="mr-1 h-4 w-4" /> Reply
          </Button>
          
          {!email.replied && (
            <Button variant="outline" onClick={handleMarkAsReplied}>
              <CheckCircle className="mr-1 h-4 w-4" /> Mark as Replied
            </Button>
          )}
          
          {email.replied && !email.responseReceived && (
            <Button variant="outline" onClick={handleMarkAsResponseReceived}>
              <Clock className="mr-1 h-4 w-4" /> Mark Response Received
            </Button>
          )}
          
          <Button variant="outline" onClick={() => navigate(`/emails/${email.category}/all`)}>
            View All {currentCategory.title} Emails
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
