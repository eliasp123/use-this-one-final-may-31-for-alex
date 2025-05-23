
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailCategoryCard from './EmailCategoryCard';
import { Heart, Home, Shield, Building, Scale, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { getUnreadEmails, getPendingEmails, getUnrespondedEmails } from '../data/emailData';

interface EmailDashboardProps {
  searchQuery?: string;
}

const EmailDashboard: React.FC<EmailDashboardProps> = ({ searchQuery = '' }) => {
  const navigate = useNavigate();
  const [totalUnread, setTotalUnread] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalUnresponded, setTotalUnresponded] = useState(0);
  
  // Load email counts
  useEffect(() => {
    setTotalUnread(getUnreadEmails().length);
    setTotalPending(getPendingEmails().length);
    setTotalUnresponded(getUnrespondedEmails().length);
  }, []);
  
  const emailCategories = [
    {
      id: 'senior-living',
      title: 'Senior Living',
      icon: Heart,
      unread: getUnreadEmails('senior-living').length,
      pending: getPendingEmails('senior-living').length,
      total: 12,
      color: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700'
    },
    {
      id: 'home-care',
      title: 'Home Care',
      icon: Home,
      unread: getUnreadEmails('home-care').length,
      pending: getPendingEmails('home-care').length,
      total: 8,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'federal-benefits',
      title: 'Federal Benefits',
      icon: Shield,
      unread: getUnreadEmails('federal-benefits').length,
      pending: getPendingEmails('federal-benefits').length,
      total: 15,
      color: 'from-emerald-400 to-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      id: 'local-government',
      title: 'Local Government',
      icon: Building,
      unread: getUnreadEmails('local-government').length,
      pending: getPendingEmails('local-government').length,
      total: 6,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'attorneys',
      title: 'Attorneys',
      icon: Scale,
      unread: getUnreadEmails('attorneys').length,
      pending: getPendingEmails('attorneys').length,
      total: 9,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      id: 'other-professionals',
      title: 'Other Professionals',
      icon: Users,
      unread: getUnreadEmails('other-professionals').length,
      pending: getPendingEmails('other-professionals').length,
      total: 9,
      color: 'from-indigo-400 to-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ];

  // Filter categories based on search query
  const filteredCategories = emailCategories.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSummaryCardClick = (status: string) => {
    navigate(`/emails/all/${status}`);
  };

  // Split the categories into rows of 3 for consistent spacing
  const rows = [];
  for (let i = 0; i < filteredCategories.length; i += 3) {
    rows.push(filteredCategories.slice(i, i + 3));
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Three Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {/* Unread Messages Card */}
        <Card 
          className="border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleSummaryCardClick('unread')}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Unread Messages</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-2xl sm:text-3xl font-medium text-gray-800">{totalUnread}</p>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Replies Card */}
        <Card 
          className="border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleSummaryCardClick('pending')}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Pending Replies</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-2xl sm:text-3xl font-medium text-gray-800">{totalPending}</p>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Has Not Responded Yet Card */}
        <Card 
          className="border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleSummaryCardClick('unresponded')}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Has Not Responded Yet</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-2xl sm:text-3xl font-medium text-gray-800">{totalUnresponded}</p>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Category Grid with consistent row spacing */}
      <div className="space-y-8 sm:space-y-12">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {row.map((category) => (
              <EmailCategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailDashboard;
