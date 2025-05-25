
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { getAllEmailsWithAttachments } from '../../utils/emailDataUtils';
import { cn } from '@/lib/utils';

interface ToFieldAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ToFieldAutocomplete = ({
  value,
  onChange,
  placeholder = "e.g., Dr. Smith, Family Member (optional)",
  className
}: ToFieldAutocompleteProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [recipients, setRecipients] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract unique recipients from email data
  useEffect(() => {
    console.log('🔍 ToFieldAutocomplete: Starting recipient extraction...');
    const emails = getAllEmailsWithAttachments();
    const recipientSet = new Set<string>();
    
    console.log('📧 Processing emails for recipients', { totalEmails: emails.length });
    
    emails.forEach((email, index) => {
      console.log(`📨 Email ${index + 1}:`, { 
        id: email.id, 
        recipient: email.recipient, 
        sender: email.sender.name,
        organization: email.sender.organization
      });
      
      // Extract recipient name from email strings like "Dr. Patricia Williams <dr.williams@citymedical.com>"
      let recipientName = '';
      
      if (email.recipient.includes('<')) {
        const match = email.recipient.match(/^(.+?)\s*<.*>$/);
        if (match && match[1]) {
          recipientName = match[1].trim();
        }
      } else if (!email.recipient.includes('@')) {
        recipientName = email.recipient.trim();
      }
      
      if (recipientName && recipientName !== 'you@example.com') {
        recipientSet.add(recipientName);
        console.log('✅ Added recipient:', recipientName);
      }
      
      // Also extract from sender names
      if (email.sender.name && email.sender.name !== 'Johnson Family') {
        recipientSet.add(email.sender.name);
        console.log('✅ Added sender as potential recipient:', email.sender.name);
      }
      
      // Also extract from sender organization names
      if (email.sender.organization && email.sender.organization !== 'Johnson Family') {
        recipientSet.add(email.sender.organization);
        console.log('✅ Added organization as potential recipient:', email.sender.organization);
      }
    });
    
    const uniqueRecipients = Array.from(recipientSet).sort();
    console.log('🎯 Final recipients list:', { 
      count: uniqueRecipients.length, 
      recipients: uniqueRecipients 
    });
    setRecipients(uniqueRecipients);
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    console.log('🔍 Filter effect triggered:', { value, recipients: recipients.length });
    
    if (value.trim() === '') {
      console.log('❌ Empty value, hiding suggestions');
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const searchTerm = value.toLowerCase();
    const filtered = recipients.filter(recipient => 
      recipient.toLowerCase().includes(searchTerm)
    );
    
    console.log('🎯 Filtering results:', { 
      searchTerm: `"${searchTerm}"`,
      totalRecipients: recipients.length,
      matchCount: filtered.length, 
      matches: filtered,
      willShow: filtered.length > 0
    });
    
    setFilteredSuggestions(filtered.slice(0, 5));
    setActiveSuggestion(0);
    setShowSuggestions(filtered.length > 0);
  }, [value, recipients]);

  // Debug effect to track showSuggestions state
  useEffect(() => {
    console.log('📊 Suggestions state changed:', {
      showSuggestions,
      filteredCount: filteredSuggestions.length,
      suggestions: filteredSuggestions
    });
  }, [showSuggestions, filteredSuggestions]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        console.log('👆 Clicked outside, hiding suggestions');
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('✏️ Input changed:', { newValue });
    onChange(newValue);
    setActiveSuggestion(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('⌨️ Key pressed:', { key: e.key, showSuggestions, suggestionsCount: filteredSuggestions.length });
    
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev === 0 ? filteredSuggestions.length - 1 : prev - 1));
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev === filteredSuggestions.length - 1 ? 0 : prev + 1));
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (filteredSuggestions[activeSuggestion]) {
        console.log('🎯 Selected suggestion:', filteredSuggestions[activeSuggestion]);
        onChange(filteredSuggestions[activeSuggestion]);
        setShowSuggestions(false);
      }
    }
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('👆 Suggestion clicked:', suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    console.log('🎯 Input focused:', { value, hasFilteredSuggestions: filteredSuggestions.length > 0 });
    if (value.trim() !== '' && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        id="to"
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={cn(
          "text-lg py-6 border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:ring-gray-400",
          className
        )}
      />

      {/* Force visible dropdown for debugging */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-[10000]"
          style={{
            position: 'absolute',
            backgroundColor: '#ffffff',
            border: '2px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 10000
          }}
        >
          <div className="p-2 text-xs text-gray-500 border-b border-gray-200">
            Debug: {filteredSuggestions.length} suggestions found
          </div>
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={`${suggestion}-${index}`}
              className={cn(
                "px-4 py-3 text-lg cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                index === activeSuggestion ? 'bg-orange-100 text-orange-800 font-medium' : 'hover:bg-gray-50 text-gray-900'
              )}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setActiveSuggestion(index)}
              style={{
                backgroundColor: index === activeSuggestion ? '#fed7aa' : 'transparent'
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToFieldAutocomplete;
