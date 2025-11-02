"use client"

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
// ✨ --- NEW ICON IMPORTS --- ✨
import { Loader2, Send, CheckCircle, XCircle } from 'lucide-react';

interface Recipient {
  email: string;
  name?: string;
}

interface MessageUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Recipient[];
}

export const MessageUserModal: React.FC<MessageUserModalProps> = ({
  isOpen,
  onClose,
  recipients,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  // ✨ --- NEW STATE TO MANAGE THE VIEW --- ✨
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: (variables: { recipientEmails: string[], subject: string, message: string }) => 
      fetch('/api/messaging/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables)
      }).then(async res => {
        if (!res.ok) {
          // Try to get a more specific error message from the API response body
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || 'Failed to send message.');
        }
        return res.json();
      }),
    onSuccess: () => {
      // ✨ Instead of closing, switch to the success view
      setSubmissionStatus('success');
    },
    onError: (error: any) => {
      // ✨ Instead of a toast, switch to the error view
      setSubmissionStatus('error');
      setSubmissionError(error.message || 'An unknown server error occurred.');
    },
    onSettled: () => {
      // Still useful for clearing the form inputs in the background
      setSubject('');
      setMessage('');
    }
  });

  const handleSubmit = () => {
    if (!subject || !message) {
      toast({ title: 'Missing fields', description: 'Please provide a subject and a message.', variant: 'destructive' });
      return;
    }
    const recipientEmails = recipients.map(r => r.email);
    sendMessageMutation.mutate({ recipientEmails, subject, message });
  };

  const handleReset = () => {
    setSubmissionStatus(null);
    setSubmissionError(null);
  }
  
  const handleClose = () => {
    handleReset(); // Ensure the modal is reset for the next time it opens
    onClose();
  }

  // Fallback to email if name is not provided
  const recipientLabel = recipients.length === 1 
    ? recipients[0].name || recipients[0].email
    : `${recipients.length} users`;

  return (
    <Modal
      title={submissionStatus ? 'Message Status' : `Send Message to ${recipientLabel}`}
      description={submissionStatus ? 'The status of your message delivery is shown below.' : 'The message will be sent via email to the selected user(s).'}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="space-y-4 py-2 pb-4">
        {/* --- UI State 1: Loading --- */}
        {sendMessageMutation.isPending && (
          <div className="flex flex-col items-center justify-center p-8 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Sending message...</p>
          </div>
        )}

        {/* --- UI State 2: Displaying Results --- */}
        {!sendMessageMutation.isPending && submissionStatus && (
          <div className="flex flex-col items-center text-center p-4">
            {submissionStatus === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Message Sent Successfully!</h3>
                <p className="text-sm text-muted-foreground">The selected user(s) have been notified via email.</p>
              </>
            )}
            {submissionStatus === 'error' && (
               <>
                <XCircle className="h-16 w-16 text-destructive mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Message Failed to Send</h3>
                <p className="text-sm text-muted-foreground">{submissionError}</p>
              </>
            )}
            <div className="pt-6 space-x-2 flex items-center justify-center w-full">
              <Button variant="outline" onClick={handleReset}>Send Another Message</Button>
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        )}
        
        {/* --- UI State 3: The Initial Form --- */}
        {!sendMessageMutation.isPending && !submissionStatus && (
          <>
            <Input
              placeholder="Message Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={sendMessageMutation.isPending}
            />
            <Textarea
              placeholder="Type your message here..."
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sendMessageMutation.isPending}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button disabled={sendMessageMutation.isPending} variant="outline" onClick={handleClose}>Cancel</Button>
              <Button disabled={sendMessageMutation.isPending} onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
