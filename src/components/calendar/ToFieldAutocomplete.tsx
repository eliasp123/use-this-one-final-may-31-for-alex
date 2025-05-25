
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
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Extract unique recipients from email data
  useEffect(() => {
    const emails = getAllEmailsWithAttachments();
    const recipientSet = new Set<string>();
    
    console.log('ToFieldAutocomplete: Processing emails for recipients', { totalEmails: emails.length });
    
    emails.forEach(email => {
      console.log('Processing email:', { 
        id: email.id, 
        recipient: email.recipient, 
        sender: email.sender 
      });
      
      // Extract recipient name from email strings like "Dr. Patricia Williams <dr.williams@citymedical.com>"
      // or just plain names like "Dr. Patricia Williams"
      let recipientName = '';
      
      if (email.recipient.includes('<')) {
        // Format: "Name <email@domain.com>"
        const match = email.recipient.match(/^(.+?)\s*<.*>$/);
        if (match && match[1]) {
          recipientName = match[1].trim();
        }
      } else {
        // Plain name or email
        recipientName = email.recipient.trim();
      }
      
      if (recipientName && recipientName !== 'you@example.com' && !recipientName.includes('@')) {
        recipientSet.add(recipientName);
        console.log('Added recipient:', recipientName);
      }
      
      // Also extract from sender names (people who have emailed you)
      if (email.sender.name && email.sender.name !== 'Johnson Family') {
        recipientSet.add(email.sender.name);
        console.log('Added sender as potential recipient:', email.sender.name);
      }
      
      // Also extract from sender organization names
      if (email.sender.organization && email.sender.organization !== 'Johnson Family') {
        recipientSet.add(email.sender.organization);
        console.log('Added organization as potential recipient:', email.sender.organization);
      }
    });
    
    const uniqueRecipients = Array.from(recipientSet).sort();
    console.log('ToFieldAutocomplete: Final recipients list', { 
      count: uniqueRecipients.length, 
      recipients: uniqueRecipients 
    });
    setRecipients(uniqueRecipients);
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    console.log('Filtering suggestions for input:', { value, recipientsCount: recipients.length });
    
    if (value.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    
    const filtered = recipients.filter(
      recipient => recipient.toLowerCase().includes(value.toLowerCase())
    );
    
    console.log('Filtered suggestions:', { 
      input: value, 
      matchCount: filtered.length, 
      matches: filtered 
    });
    
    setFilteredSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
  }, [value, recipients]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input changed:', { newValue, willShowSuggestions: newValue.trim() !== '' });
    onChange(newValue);
    if (newValue.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setActiveSuggestion(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', { key: e.key, suggestionsCount: filteredSuggestions.length });
    
    // If no suggestions, do nothing
    if (filteredSuggestions.length === 0) return;

    // Up arrow
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev === 0 ? filteredSuggestions.length - 1 : prev - 1));
    }
    // Down arrow 
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev === filteredSuggestions.length - 1 ? 0 : prev + 1));
    }
    // Enter key
    else if (e.key === 'Enter' && showSuggestions) {
      e.preventDefault();
      e.stopPropagation();
      if (filteredSuggestions[activeSuggestion]) {
        console.log('Selected suggestion:', filteredSuggestions[activeSuggestion]);
        onChange(filteredSuggestions[activeSuggestion]);
        setShowSuggestions(false);
      }
    }
    // Escape key
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Clicked suggestion:', suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    console.log('Input focused:', { value: value.trim(), recipientsCount: recipients.length });
    if (value.trim() !== '' && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
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

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef} 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={cn(
                "px-4 py-3 text-lg cursor-pointer transition-colors",
                index === activeSuggestion ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50'
              )}
              onClick={() => handleSuggestionClick(suggestion)}
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
