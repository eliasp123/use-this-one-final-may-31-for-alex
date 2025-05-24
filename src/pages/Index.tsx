
import React, { useState } from 'react';
import RoleAwareEmailDashboard from '../components/RoleAwareEmailDashboard';
import CalendarSection from '../components/CalendarSection';
import NewEmailForm from '../components/NewEmailForm';
import { Info, Pencil, FileText, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Button } from '../components/ui/button';
import AutocompleteSearch from '../components/AutocompleteSearch';
import { useUserRole } from '../hooks/useUserRole';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import CalendarPopup from '../components/CalendarPopup';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewEmailForm, setShowNewEmailForm] = useState(false);
  const { userRole, setUserRole } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewEmail = (emailData: any) => {
    // This is where you'll integrate with actual email sending
    console.log('New email to be sent:', emailData);
    
    toast({
      title: "Email Sent",
      description: `Email sent to ${emailData.toName} at ${emailData.toOrganization}`,
    });
  };

  // Keep the toggle function available for programmer use
  const toggleUserRole = () => {
    const newRole = userRole === 'primary-caregiver' ? 'family-member' : 'primary-caregiver';
    setUserRole(newRole);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-4 sm:py-8 pt-16">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-light text-gray-800 mb-2 sm:mb-4">Communication Hub</h1>
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-sm sm:text-base text-gray-600 font-light flex items-center gap-2">
              Stay on top of your important conversations
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center justify-center rounded-full w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 transition-colors">
                    <Info className="h-3 w-3" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 sm:w-80 p-4">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-800">What are Conversations?</h4>
                    <p className="text-gray-600 text-sm">
                      Conversations are meaningful exchanges with organizations helping your loved ones. 
                      Rather than sorting through isolated emails, you can track complete interactions with senior living 
                      facilities, healthcare providers, and benefit programs—all in one place.
                    </p>
                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                        <span>Unread messages need your attention</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                        <span>Pending replies are waiting for responses</span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </p>
            
            {/* Action buttons centered under the subheader with spacing */}
            <div className="mt-6 sm:mt-8 flex gap-3">
              <CalendarPopup 
                trigger={
                  <Button
                    variant="outline"
                    className="px-6 py-3 h-11 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                  </Button>
                }
              />
              
              <Button
                onClick={() => setShowNewEmailForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 h-11 rounded-lg font-medium"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Compose New Email
              </Button>
              
              <Button
                onClick={() => navigate('/documents')}
                variant="outline"
                className="px-6 py-3 h-11 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Documents
              </Button>
            </div>
          </div>
        </div>
        
        {/* Role toggle button - Hidden from UI but available for programmer use */}
        {/* Uncomment the block below for programmer testing:
        <div className="flex justify-center mb-4">
          <Button 
            onClick={toggleUserRole}
            variant="outline"
            size="sm"
            className="text-sm"
          >
            Switch to {userRole === 'primary-caregiver' ? 'Family Member' : 'Primary Caregiver'} View
          </Button>
        </div>
        */}
        
        {/* Search Bar with Autocomplete */}
        <div className="max-w-xs sm:max-w-md mx-auto mb-6 sm:mb-8">
          <AutocompleteSearch onSearch={handleSearch} initialValue={searchQuery} />
        </div>
        
        <RoleAwareEmailDashboard searchQuery={searchQuery} />

        {/* Calendar Section with margin top for separation */}
        <div className="mt-10 sm:mt-16">
          <CalendarSection />
        </div>

        {/* New Email Form */}
        <NewEmailForm
          isOpen={showNewEmailForm}
          onClose={() => setShowNewEmailForm(false)}
          onSend={handleNewEmail}
        />
      </div>
    </div>
  );
};

export default Index;
