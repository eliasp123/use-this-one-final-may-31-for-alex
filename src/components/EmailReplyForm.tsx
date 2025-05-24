import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { Send, X, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCalendarLogic } from '@/hooks/useCalendarLogic';
import { Calendar } from '@/components/ui/calendar';
import AppointmentList from './calendar/AppointmentList';
import { APPOINTMENTS } from '../data/appointmentData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EmailReplyFormProps {
  originalEmail: {
    sender: {
      name: string;
      email: string;
      organization: string;
    };
    subject: string;
    date: string;
    content: string;
  };
  onClose: () => void;
  onSend: (replyData: ReplyFormData) => void;
}

interface ReplyFormData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  content: string;
}

const EmailReplyForm: React.FC<EmailReplyFormProps> = ({ 
  originalEmail, 
  onClose, 
  onSend 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  
  // Use calendar logic hook for interactive functionality
  const {
    date,
    selectedDateAppointments,
    isDayWithAppointment,
    handleSelect,
    getUpcomingAppointments,
    handleAppointmentClick
  } = useCalendarLogic();

  const upcomingAppointments = getUpcomingAppointments();
  
  const form = useForm<ReplyFormData>({
    defaultValues: {
      to: originalEmail.sender.email,
      cc: '',
      bcc: '',
      subject: originalEmail.subject.startsWith('Re: ') 
        ? originalEmail.subject 
        : `Re: ${originalEmail.subject}`,
      content: `\n\n---\nOn ${new Date(originalEmail.date).toLocaleDateString()} at ${new Date(originalEmail.date).toLocaleTimeString()}, ${originalEmail.sender.name} <${originalEmail.sender.email}> wrote:\n\n${originalEmail.content.split('\n').map(line => `> ${line}`).join('\n')}`
    }
  });

  const handleSubmit = async (data: ReplyFormData) => {
    setIsSubmitting(true);
    
    try {
      // This is where you'll integrate with Nylas later
      console.log('Reply data to be sent via Nylas:', {
        ...data,
        ccEmails: data.cc ? data.cc.split(',').map(email => email.trim()).filter(email => email) : [],
        bccEmails: data.bcc ? data.bcc.split(',').map(email => email.trim()).filter(email => email) : []
      });
      
      // Simulate sending (replace with actual Nylas integration)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSend(data);
      
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAppointment = () => {
    // Placeholder for add appointment functionality
    console.log('Add appointment clicked from email reply form');
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">Reply to {originalEmail.sender.name}</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-gray-50" 
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CC/BCC Toggle - Made more prominent with purple styling */}
            <div className="flex justify-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCcBcc(!showCcBcc)}
                className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-800 font-medium"
              >
                {showCcBcc ? (
                  <>
                    <ChevronUp className="mr-1 h-4 w-4" />
                    Hide CC/BCC
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 h-4 w-4" />
                    Add CC/BCC
                  </>
                )}
              </Button>
            </div>

            {/* CC/BCC Fields */}
            {showCcBcc && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CC</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="email1@example.com, email2@example.com"
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">Separate multiple emails with commas</p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bcc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BCC</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="email1@example.com, email2@example.com"
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">Separate multiple emails with commas</p>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interactive Calendar Accordion */}
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="calendar" className="border-none">
                  <AccordionTrigger className="bg-orange-100 hover:bg-orange-200 px-4 py-3 rounded-lg font-medium text-orange-900 hover:no-underline">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Click to see your calendar
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-0">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="w-full max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            <Card className="overflow-hidden shadow-sm border border-gray-100">
                              <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-full md:w-1/3 flex flex-col">
                                    <div className="p-4">
                                      <Button
                                        type="button"
                                        onClick={handleAddAppointment}
                                        className="bg-white hover:bg-gray-50 text-gray-600 font-bold py-3 px-6 rounded-lg border transition-all duration-200 w-full"
                                      >
                                        <CalendarIcon className="mr-2 h-5 w-5" />
                                        Add Appointment
                                      </Button>
                                    </div>
                                    
                                    <div className="p-4">
                                      <FormLabel className="text-white text-sm font-medium mb-2 block">Date:</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            className={cn(
                                              "w-full justify-start text-left font-normal bg-white",
                                              !date && "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={handleSelect}
                                            initialFocus
                                            className="p-3 pointer-events-auto"
                                            modifiers={{
                                              hasAppointment: (date) => isDayWithAppointment(date),
                                            }}
                                            modifiersClassNames={{
                                              hasAppointment: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full',
                                            }}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                    
                                    <div className="p-8 pt-4 flex-1 flex flex-col justify-center">
                                      <p className="text-white text-xl font-light uppercase mb-1">{date ? format(date, 'EEEE') : ''}</p>
                                      <p className="text-white text-4xl font-light uppercase mb-10">{date ? format(date, 'MMMM do') : ''}</p>
                                      <p className="text-white/70 text-sm font-light">{date ? format(date, 'yyyy') : ''}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="w-full md:w-2/3 p-4 bg-white relative">
                                    <Calendar
                                      mode="single"
                                      selected={date}
                                      onSelect={handleSelect}
                                      className="w-full pointer-events-auto"
                                      modifiers={{
                                        hasAppointment: (date) => isDayWithAppointment(date),
                                      }}
                                      modifiersClassNames={{
                                        hasAppointment: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full',
                                      }}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="md:col-span-1">
                            <AppointmentList 
                              date={date}
                              selectedAppointments={selectedDateAppointments}
                              upcomingAppointments={upcomingAppointments}
                              onAppointmentClick={handleAppointmentClick}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={12}
                      className="resize-none"
                      placeholder="Type your reply here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-1 h-4 w-4" /> Send Reply
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EmailReplyForm;
