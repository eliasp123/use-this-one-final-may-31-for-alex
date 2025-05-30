
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getEmailByIdWithAttachments } from '../utils/emailDataUtils';
import { EmailData } from '../types/email';
import { useEmailCategoryData } from '@/hooks/useEmailCategoryData';
import EmailDetailHeader from '../components/email-detail/EmailDetailHeader';
import EmailDetailCard from '../components/email-detail/EmailDetailCard';
import EmailDetailActions from '../components/email-detail/EmailDetailActions';
import EmailSidebar from '../components/email-list/EmailSidebar';
import EmailReplyForm from '../components/EmailReplyForm';
import NewEmailForm from '../components/NewEmailForm';
import AppointmentFormSidebarContent from '../components/calendar/AppointmentFormSidebarContent';
import { useToast } from '../hooks/use-toast';
import { useCalendarLogic } from '../hooks/useCalendarLogic';
import { Mail, ArrowLeft, Home, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState<EmailData | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showNewEmailForm, setShowNewEmailForm] = useState(false);
  const [showCalendarSidebar, setShowCalendarSidebar] = useState(true);
  const { emailCategories, refreshCategories } = useEmailCategoryData();
  const { toast } = useToast();
  
  // Use calendar logic for sidebar
  const {
    date,
    selectedDateAppointments,
    handleSelect
  } = useCalendarLogic();
  
  useEffect(() => {
    // Force scroll to top immediately and override any other scroll behavior
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    if (id) {
      const foundEmail = getEmailByIdWithAttachments(id);
      if (foundEmail) {
        setEmail(foundEmail);
        
        // In a real app, we would mark it as read on the server
        // For this mock, we'll just update the local state
        if (!foundEmail.read) {
          foundEmail.read = true;
        }
      }
    }
    
    // Additional scroll to top after a brief delay to ensure it takes effect
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [id]);
  
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-medium text-gray-800 mb-3">
            Oops! Email Not Found
          </h2>
          
          <p className="text-gray-600 mb-2 leading-relaxed">
            We couldn't locate the email you're looking for. It may have been moved, deleted, or the link might be outdated.
          </p>
          
          <p className="text-sm text-gray-500 mb-8">
            Don't worry - your other emails are safe and waiting for you!
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/emails/all/all')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse All Emails
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Communication Hub
            </Button>
          </div>
          
          <p className="text-xs text-gray-400 mt-6">
            Use the sidebar to browse emails by category or status
          </p>
        </div>
      </div>
    );
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

  const handleMarkAsPrivate = () => {
    if (email) {
      email.private = !email.private;
      // Force a re-render
      setEmail({...email});
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(true);
  };

  const handleReplyAllClick = () => {
    // For now, same functionality as regular reply
    // Can be enhanced later to include all recipients
    setShowReplyForm(true);
  };

  const handleReplyClose = () => {
    setShowReplyForm(false);
  };

  const handleReplySend = (replyData: any) => {
    // This will be connected to Nylas later
    console.log('Reply sent:', replyData);
    
    // Update email status
    if (email) {
      email.replied = true;
      setEmail({...email});
    }
    
    setShowReplyForm(false);
  };

  const handleNewEmail = (emailData: any) => {
    // This is where you'll integrate with actual email sending
    console.log('New email to be sent:', emailData);
    
    toast({
      title: "Email Sent",
      description: `Email sent to ${emailData.toName} at ${emailData.toOrganization}`,
    });
  };

  const handleCalendarExpand = () => {
    // Navigate to full calendar view or expand functionality
    navigate('/#calendar-section');
  };
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex w-full">
        {/* Left Sidebar */}
        <EmailSidebar 
          emailCategories={emailCategories} 
          category={email.category} 
          activeTab="all"
          onCategoryAdded={refreshCategories}
        />
        
        {/* Main Content */}
        <div className={`flex-1 pl-24 transition-all duration-300 ${showCalendarSidebar ? 'pr-8' : 'pr-32'}`}>
          <div className="container mx-auto px-4 py-8">
            <EmailDetailHeader email={email} />
            
            {/* Actions Above Email Card */}
            <EmailDetailActions
              email={email}
              onReplyClick={handleReplyClick}
              onReplyAllClick={handleReplyAllClick}
              onMarkAsReplied={handleMarkAsReplied}
              onMarkAsResponseReceived={handleMarkAsResponseReceived}
              onMarkAsPrivate={handleMarkAsPrivate}
              onComposeClick={() => setShowNewEmailForm(true)}
              showReplyForm={showReplyForm}
              position="above"
            />
            
            <EmailDetailCard email={email} />
            
            {/* Actions Below Email Card */}
            <EmailDetailActions
              email={email}
              onReplyClick={handleReplyClick}
              onReplyAllClick={handleReplyAllClick}
              onMarkAsReplied={handleMarkAsReplied}
              onMarkAsResponseReceived={handleMarkAsResponseReceived}
              onMarkAsPrivate={handleMarkAsPrivate}
              onComposeClick={() => setShowNewEmailForm(true)}
              showReplyForm={showReplyForm}
              position="below"
            />
            
            {/* Reply Form */}
            {showReplyForm && (
              <EmailReplyForm
                originalEmail={email}
                onClose={handleReplyClose}
                onSend={handleReplySend}
              />
            )}

            {/* New Email Form */}
            <NewEmailForm
              isOpen={showNewEmailForm}
              onClose={() => setShowNewEmailForm(false)}
              onSend={handleNewEmail}
            />
          </div>
        </div>

        {/* Calendar Sidebar */}
        {showCalendarSidebar && (
          <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col">
            {/* Calendar Sidebar Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-800">Calendar</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCalendarExpand}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCalendarSidebar(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Sidebar Content */}
            <div className="flex-1">
              <AppointmentFormSidebarContent
                selectedDate={date}
                selectedDateAppointments={selectedDateAppointments}
              />
            </div>
          </div>
        )}

        {/* Toggle Calendar Sidebar Button (when hidden) */}
        {!showCalendarSidebar && (
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalendarSidebar(true)}
              className="bg-white shadow-lg border-gray-300 hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default EmailDetail;
