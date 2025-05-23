import React from 'react';
import EmailCategoryCard from './EmailCategoryCard';
import { Heart, Home, Shield, Building, Scale, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface EmailDashboardProps {
  searchQuery?: string;
}

const EmailDashboard: React.FC<EmailDashboardProps> = ({ searchQuery = '' }) => {
  const emailCategories = [
    {
      id: 'senior-living',
      title: 'Senior Living',
      icon: Heart,
      unread: 3,
      pending: 1,
      total: 12,
      color: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700'
    },
    {
      id: 'home-care',
      title: 'Home Care',
      icon: Home,
      unread: 2,
      pending: 0,
      total: 8,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'federal-benefits',
      title: 'Federal Benefits',
      icon: Shield,
      unread: 1,
      pending: 2,
      total: 15,
      color: 'from-emerald-400 to-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      id: 'local-government',
      title: 'Local Government',
      icon: Building,
      unread: 0,
      pending: 1,
      total: 6,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'attorneys',
      title: 'Attorneys',
      icon: Scale,
      unread: 4,
      pending: 3,
      total: 18,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      id: 'other-professionals',
      title: 'Other Professionals',
      icon: Users,
      unread: 2,
      pending: 1,
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

  const totalUnread = filteredCategories.reduce((sum, category) => sum + category.unread, 0);
  const totalPending = filteredCategories.reduce((sum, category) => sum + category.pending, 0);
  const totalAwaitingResponse = filteredCategories.reduce((sum, category) => {
    // Count categories that have unread messages but no pending replies
    return sum + (category.unread > 0 && category.pending === 0 ? 1 : 0);
  }, 0);
  
  const activeCategories = filteredCategories.reduce((sum, category) => {
    // Count categories that have either unread messages or pending replies
    return sum + (category.unread > 0 || category.pending > 0 ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Three Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Unread Messages Card */}
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mb-3">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Unread Messages</p>
              <p className="text-3xl font-light text-gray-800 mt-1">{totalUnread}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Awaiting Your Reply Card */}
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Awaiting Your Reply</p>
              <p className="text-3xl font-light text-gray-800 mt-1">{totalPending}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Has Not Responded Yet Card */}
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-3">
                <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Has Not Responded Yet</p>
              <p className="text-3xl font-light text-gray-800 mt-1">{totalAwaitingResponse}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredCategories.map((category) => (
          <EmailCategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </div>
  );
};

export default EmailDashboard;
