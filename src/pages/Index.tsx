
import React from 'react';
import EmailDashboard from '../components/EmailDashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2">Communication Hub</h1>
          <p className="text-gray-600 font-light">Stay on top of your important conversations</p>
        </div>
        <EmailDashboard />
      </div>
    </div>
  );
};

export default Index;
