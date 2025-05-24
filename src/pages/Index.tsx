import React, { useState } from 'react';
import RoleAwareEmailDashboard from '../components/RoleAwareEmailDashboard';
import CalendarSection from '../components/CalendarSection';
import NewEmailForm from '../components/NewEmailForm';
import { Info, Pencil, FileText, Search, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';
import AutocompleteSearch from '../components/AutocompleteSearch';
import { useUserRole } from '../hooks/useUserRole';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import CalendarPopup from '../components/CalendarPopup';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '../components/ui/pagination';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewEmailForm, setShowNewEmailForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
  
  // Pagination logic
  const itemsPerPage = 6;
  const totalCategories = 8; // Total number of email categories
  const totalPages = Math.ceil(totalCategories / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Removed the scrollIntoView behavior - no need for scrolling
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
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
            <div className="mt-6 sm:mt-8 flex gap-3 justify-center">
              <Button
                onClick={() => setShowNewEmailForm(true)}
                className="w-64 bg-green-500 hover:bg-green-600 text-white px-6 py-3 h-12 rounded-lg font-medium flex items-center justify-center"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Compose New Email
              </Button>
              
              <Button
                onClick={() => navigate('/documents')}
                variant="outline"
                className="w-64 px-6 py-3 h-12 rounded-lg font-medium border-gray-300 hover:bg-gray-50 flex items-center justify-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Documents
              </Button>

              <Button
                onClick={() => setShowCalendar(true)}
                variant="outline"
                className="w-64 px-6 py-3 h-12 rounded-lg font-medium border-gray-300 hover:bg-gray-50 flex items-center justify-center"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
            </div>

            {/* Pagination - Centered under action buttons */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12">
                <Pagination className="">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }} 
                        />
                      </PaginationItem>
                    )}
                    
                    {pageNumbers.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href="#" 
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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
        
        {/* Search Bar with Autocomplete - Styled to match Document Hub */}
        <div className="max-w-xs sm:max-w-md mx-auto mb-12 sm:mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 text-base bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <RoleAwareEmailDashboard searchQuery={searchQuery} currentPage={currentPage} />

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

        {/* Calendar Popup */}
        <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
          <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white">
            <CalendarPopup showTrigger={false} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
