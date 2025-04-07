import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ContactMessageDetailsProps {
  open: boolean;
  onClose: () => void;
  message?: ContactMessage;
}

const ContactMessageDetails = ({ open, onClose, message }: ContactMessageDetailsProps) => {
  const { toast } = useToast();
  
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!message) return;
      const res = await apiRequest('PATCH', `/api/admin/contact/${message.id}/read`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact'] });
      toast({
        title: 'Message marked as read',
        description: 'Contact message has been marked as read.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark message as read.',
        variant: 'destructive',
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!message) return;
      await apiRequest('DELETE', `/api/admin/contact/${message.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact'] });
      toast({
        title: 'Message deleted',
        description: 'Contact message has been deleted successfully.',
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete contact message.',
        variant: 'destructive',
      });
    }
  });
  
  const handleWhatsAppContact = () => {
    if (!message) return;
    
    // Format the message for WhatsApp
    const whatsAppText = `Hello ${message.name},\n\nThank you for contacting Abie Cakes. This is regarding your message: "${message.subject}"\n\n`;
    const whatsAppLink = `https://wa.me/?text=${encodeURIComponent(whatsAppText)}`;
    
    window.open(whatsAppLink, '_blank');
  };

  const isPending = markAsReadMutation.isPending || deleteMutation.isPending;
  
  if (!message) return null;
  
  // Format date in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !isPending && !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contact Message Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">From</p>
              <p className="text-base font-medium">{message.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base font-medium break-all">{message.email}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Subject</p>
            <p className="text-base font-medium">{message.subject}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Date Received</p>
            <p className="text-base">{formatDate(message.createdAt)}</p>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end items-center mt-6">
            <Button 
              variant="outline" 
              onClick={handleWhatsAppContact}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Reply via WhatsApp
            </Button>
            
            {!message.read && (
              <Button 
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => markAsReadMutation.mutate()}
                disabled={isPending}
              >
                {markAsReadMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Mark as Read
              </Button>
            )}
            
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto"
              onClick={() => deleteMutation.mutate()}
              disabled={isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactMessageDetails;