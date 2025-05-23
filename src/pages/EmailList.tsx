import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getEmailsByCategory, 
  getUnreadEmails, 
  getPendingEmails, 
  getUnrespondedEmails, 
  getAllEmails 
} from '../data/emailData';
import { EmailData } from '../types/email';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, Mail } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import AutocompleteSearch from '../components/AutocompleteSearch';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupLabel 
} from '../components/ui/sidebar';
import { useEmailCategoryData } from '../hooks/useEmailCategoryData';

const EmailList = () => {
  const { category, status } = useParams();
  const navigate = useNavigate();
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [activeTab, setActiveTab] = useState<string>(status || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmails, setFilteredEmails] = useState<EmailData[]>([]);
  const { emailCategories } = useEmailCategoryData();
  
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
    },
    'va': { 
      title: 'VA', 
      color: 'bg-gradient-to-r from-teal-400 to-teal-500',
      bgColor: 'bg-teal-50' 
    },
    'physical-therapy': { 
      title: 'Physical Therapy', 
      color: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
      bgColor: 'bg-cyan-50' 
    },
    'paying-for-care': { 
      title: 'Paying for Care', 
      color: 'bg-gradient-to-r from-lime-400 to-lime-500',
      bgColor: 'bg-lime-50' 
    }
  };

  useEffect(() => {
    loadEmails();
  }, [category, activeTab]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = emails.filter(email => 
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        email.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails(emails);
    }
  }, [searchQuery, emails]);

  const loadEmails = () => {
    let fetchedEmails: EmailData[] = [];
    
    if (category) {
      // If category is specified, filter by category first
      switch (activeTab) {
        case 'unread':
          fetchedEmails = getUnreadEmails(category);
          break;
        case 'pending':
          fetchedEmails = getPendingEmails(category);
          break;
        case 'unresponded':
          fetchedEmails = getUnrespondedEmails(category);
          break;
        default:
          fetchedEmails = getEmailsByCategory(category);
      }
    } else {
      // If no category, just filter by status
      switch (activeTab) {
        case 'unread':
          fetchedEmails = getUnreadEmails();
          break;
        case 'pending':
          fetchedEmails = getPendingEmails();
          break;
        case 'unresponded':
          fetchedEmails = getUnrespondedEmails();
          break;
        default:
          fetchedEmails = getAllEmails();
      }
    }
    
    // Sort by date (newest first)
    fetchedEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEmails(fetchedEmails);
    setFilteredEmails(fetchedEmails);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL to reflect the new status without changing the category
    navigate(`/emails/${category || 'all'}/${value}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If it's today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's within the last week, show day name
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleRowClick = (emailId: string) => {
    navigate(`/email/${emailId}`);
  };

  // Get info for current category
  const currentCategory = category ? categoryInfo[category] : null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex w-full">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Categories</SidebarGroupLabel>
              <SidebarMenu>
                {emailCategories.map((cat) => (
                  <SidebarMenuItem key={cat.id}>
                    <SidebarMenuButton 
                      isActive={cat.id === category}
                      tooltip={cat.title}
                      onClick={() => navigate(`/emails/${cat.id}/${activeTab}`)}
                    >
                      <div className={`w-6 h-6 rounded-md ${cat.bgColor} flex items-center justify-center mr-2`}>
                        <cat.icon className={`w-4 h-4 ${cat.textColor}`} />
                      </div>
                      <span>{cat.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 flex-1">
          {/* Header with back button */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mb-4"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
              </Button>
              
              <h1 className="text-3xl font-light text-gray-800 mb-2">
                {currentCategory 
                  ? `${currentCategory.title} Conversations` 
                  : 'All Conversations'}
              </h1>
              
              <p className="text-sm text-gray-600 font-light">
                {filteredEmails.length} {filteredEmails.length === 1 ? 'conversation' : 'conversations'} 
                {activeTab !== 'all' ? ` - ${activeTab} messages` : ''}
              </p>
            </div>
            
            {/* Category indicator if we're viewing a specific category */}
            {currentCategory && (
              <div className={`px-4 py-2 rounded-xl ${currentCategory.bgColor} flex items-center`}>
                <span className={`w-3 h-3 rounded-full ${currentCategory.color.replace('bg-gradient-to-r', '')}`}></span>
                <span className="ml-2 text-sm font-medium text-gray-800">{currentCategory.title}</span>
              </div>
            )}
          </div>
          
          {/* Tabs for email status filtering */}
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="mb-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="unresponded">Not Responded</TabsTrigger>
              </TabsList>
              
              {/* Search */}
              <div className="w-64">
                <AutocompleteSearch onSearch={handleSearch} initialValue={searchQuery} />
              </div>
            </div>
          </Tabs>
          
          {/* Email List Table */}
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
                {filteredEmails.length > 0 ? (
                  filteredEmails.map((email) => (
                    <TableRow 
                      key={email.id} 
                      className={`cursor-pointer ${!email.read ? 'font-medium' : ''}`}
                      onClick={() => handleRowClick(email.id)}
                    >
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className={!email.read ? 'font-medium' : ''}>{email.sender.name}</span>
                          <span className="text-sm text-gray-500">{email.sender.organization}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className={!email.read ? 'font-medium' : ''}>{email.subject}</span>
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
                          {searchQuery 
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
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmailList;
