
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  
  const form = useForm<ReplyFormData>({
    defaultValues: {
      to: originalEmail.sender.email,
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
      console.log('Reply data to be sent via Nylas:', data);
      
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
