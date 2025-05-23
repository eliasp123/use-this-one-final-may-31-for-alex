import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Send, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmailData } from '@/types/email';

interface NewEmailFormProps {
  onClose: () => void;
  onSend: (emailData: NewEmailData) => void;
  isOpen: boolean;
}

interface NewEmailData {
  to: string;
  toName: string;
  toOrganization: string;
  cc: string;
  bcc: string;
  subject: string;
  content: string;
  category: string;
  isPrivate: boolean;
}

interface CustomCategoryData {
  id: string;
  title: string;
}

const predefinedCategories = [
  { id: 'senior-living', title: 'Senior Living' },
  { id: 'home-care', title: 'Home Care' },
  { id: 'federal-benefits', title: 'Federal Benefits' },
  { id: 'local-government', title: 'Local Government' },
  { id: 'attorneys', title: 'Attorneys' },
  { id: 'other-professionals', title: 'Other Professionals' },
  { id: 'va', title: 'VA' },
  { id: 'physical-therapy', title: 'Physical Therapy' },
  { id: 'paying-for-care', title: 'Paying for Care' }
];

const NewEmailForm: React.FC<NewEmailFormProps> = ({ 
  onClose, 
  onSend,
  isOpen 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customCategories, setCustomCategories] = useState<CustomCategoryData[]>([]);
  const [showCustomCategoryDialog, setShowCustomCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  
  const form = useForm<NewEmailData>({
    defaultValues: {
      to: '',
      toName: '',
      toOrganization: '',
      cc: '',
      bcc: '',
      subject: '',
      content: '',
      category: '',
      isPrivate: false
    }
  });

  const allCategories = [...predefinedCategories, ...customCategories];

  const handleAddCustomCategory = () => {
    if (newCategoryName.trim()) {
      const categoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
      const newCategory = {
        id: categoryId,
        title: newCategoryName.trim()
      };
      setCustomCategories(prev => [...prev, newCategory]);
      form.setValue('category', categoryId);
      setNewCategoryName('');
      setShowCustomCategoryDialog(false);
      
      toast({
        title: "Category Added",
        description: `"${newCategoryName.trim()}" has been added as a new category.`,
      });
    }
  };

  const handleSubmit = async (data: NewEmailData) => {
    setIsSubmitting(true);
    
    try {
      // This is where you'll integrate with Nylas later
      console.log('New email data to be sent via Nylas:', {
        ...data,
        ccEmails: data.cc ? data.cc.split(',').map(email => email.trim()).filter(email => email) : [],
        bccEmails: data.bcc ? data.bcc.split(',').map(email => email.trim()).filter(email => email) : []
      });
      
      // Simulate sending (replace with actual Nylas integration)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSend(data);
      
      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-medium">Compose New Email</CardTitle>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="to"
                  rules={{ required: "Email address is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Email *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="recipient@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="toName"
                  rules={{ required: "Recipient name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="John Doe"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="toOrganization"
                rules={{ required: "Organization is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Healthcare Center"
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
                rules={{ required: "Subject is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter email subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <div className="flex gap-2">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {allCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Dialog open={showCustomCategoryDialog} onOpenChange={setShowCustomCategoryDialog}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Add Custom Category</DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                              <Input
                                placeholder="Category name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustomCategory();
                                  }
                                }}
                              />
                              <Button onClick={handleAddCustomCategory} size="sm">
                                Add
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Private Email</FormLabel>
                        <div className="text-xs text-muted-foreground">
                          Only primary caregivers can see this
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="content"
                rules={{ required: "Message content is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={8}
                        className="resize-none"
                        placeholder="Type your message here..."
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
                      <Send className="mr-1 h-4 w-4" /> Send Email
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewEmailForm;
