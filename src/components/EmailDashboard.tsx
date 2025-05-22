
import React from 'react';
import EmailCategoryCard from './EmailCategoryCard';
import { Heart, Home, Shield, Building, Scale, Users } from 'lucide-react';

const EmailDashboard = () => {
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

  const totalUnread = emailCategories.reduce((sum, category) => sum + category.unread, 0);
  const totalPending = emailCategories.reduce((sum, category) => sum + category.pending, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Unread Messages</p>
              <p className="text-3xl font-light text-gray-800 mt-1">{totalUnread}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Replies</p>
              <p className="text-3xl font-light text-gray-800 mt-1">{totalPending}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Categories</p>
              <p className="text-3xl font-light text-gray-800 mt-1">{emailCategories.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Category Grid - Updated with smaller cards and more spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {emailCategories.map((category) => (
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
