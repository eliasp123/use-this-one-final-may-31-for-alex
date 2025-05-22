
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
        
        {/* New explanation section */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <p className="text-gray-700 mb-4">
            We've organized your communications into <span className="font-medium">Conversations</span> instead of just emails.
          </p>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">What are Conversations?</h3>
            <p className="text-gray-600 mb-4">
              Conversations are meaningful exchanges with organizations helping your loved ones. 
              Rather than sorting through isolated emails, you can track complete interactions with senior living 
              facilities, healthcare providers, and benefit programs—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm">
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
        </div>
        
        <EmailDashboard />
      </div>
    </div>
  );
};

export default Index;
