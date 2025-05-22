
import React from 'react';
import EmailDashboard from '../components/EmailDashboard';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2">Communication Hub</h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-600 font-light">Stay on top of your important conversations</p>
            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-full w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 transition-colors">
                  <Info className="h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
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
          </div>
        </div>
        
        <EmailDashboard />
      </div>
    </div>
  );
};

export default Index;
