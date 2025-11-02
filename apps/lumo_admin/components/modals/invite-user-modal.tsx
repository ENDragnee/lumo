"use client"

import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, PlusCircle, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Define the shape for each email field state
type EmailField = {
  id: number;
  value: string;
  error: string | null;
};

// Define the type for the variables our mutation function will receive
type InviteVariables = {
  emails: string[];
  role: 'member' | 'admin';
};

// Define a more specific result type for the submission feedback
type SubmissionResultItem = {
  email: string;
  status: 'success' | 'error' | 'pending';
  message: string;
};

// The expected shape of the data returned from our API on success
type InviteSuccessData = {
  results: SubmissionResultItem[];
};

// A simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fields, setFields] = useState<EmailField[]>([{ id: 1, value: '', error: null }]);
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [submissionResult, setSubmissionResult] = useState<InviteSuccessData | null>(null);
  
  const { toast } = useToast();
  const nextId = useRef(2);

  const inviteMutation = useMutation<InviteSuccessData, Error, InviteVariables>({
    mutationFn: async (variables) => {
      const response = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to send invitations.');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setSubmissionResult(data);
      onSuccess(); // Refetch data in the background
    },
    onError: (error) => {
      toast({
        title: "An unexpected error occurred",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleReset = () => {
    setFields([{ id: 1, value: '', error: null }]);
    nextId.current = 2;
    setSubmissionResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };
  
  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index].value = value;
    if (value && !EMAIL_REGEX.test(value)) {
      newFields[index].error = "Please enter a valid email address.";
    } else {
      newFields[index].error = null;
    }
    setFields(newFields);
  };

  const handleAddField = () => {
    setFields([...fields, { id: nextId.current, value: '', error: null }]);
    nextId.current += 1;
  };

  const handleRemoveField = (id: number) => {
    if (fields.length > 1) {
      setFields(fields.filter(field => field.id !== id));
    }
  };

  const handleSubmit = () => {
    let allValid = true;
    const newFields = fields.map(field => {
      if (!field.value || !EMAIL_REGEX.test(field.value)) {
        allValid = false;
        return { ...field, error: "Please enter a valid email address." };
      }
      return field;
    });

    if (!allValid) {
      setFields(newFields);
      toast({
        title: "Invalid Emails",
        description: "Please correct the highlighted fields.",
        variant: "destructive",
      });
      return;
    }

    const emailList = fields.map(field => field.value).filter(Boolean);
    const uniqueEmails = [...new Set(emailList)];

    if (uniqueEmails.length === 0) {
        toast({
            title: "No emails provided",
            description: "Please enter at least one valid email.",
            variant: "destructive"
        });
        return;
    }

    inviteMutation.mutate({ emails: uniqueEmails, role });
  };

  return (
    <Modal
      title={submissionResult ? "Invitation Results" : "Invite New Users"}
      description={submissionResult ? "Review the status of each invitation below." : "Add one or more email addresses to send invitations to."}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="space-y-4 py-2 pb-4">
        {/* --- UI State 1: Loading --- */}
        {inviteMutation.isPending && (
            <div className="flex flex-col items-center justify-center p-8 space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Sending invitations...</p>
            </div>
        )}

        {/* --- UI State 2: Displaying Results --- */}
        {!inviteMutation.isPending && submissionResult && (
          <div>
            <ul className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin pr-2">
              {submissionResult.results.map((result) => (
                <li key={result.email} className="flex items-start gap-3 p-3 bg-secondary rounded-md">
                  {result.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />}
                  {result.status === 'error' && <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />}
                  {result.status === 'pending' && <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />}
                  <div>
                    <p className="font-medium text-foreground">{result.email}</p>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button variant="outline" onClick={handleReset}>Send More Invites</Button>
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        )}

        {/* --- UI State 3: The Initial Form --- */}
        {!inviteMutation.isPending && !submissionResult && (
          <>
            <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin pr-2">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="name@example.com"
                      value={field.value}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      className={field.error ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveField(field.id)}
                      disabled={fields.length <= 1}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>
                  {field.error && <p className="text-sm text-destructive mt-1 px-1">{field.error}</p>}
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" onClick={handleAddField}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add another email
            </Button>
            
            <div className="pt-4">
              <Select onValueChange={(value: 'member' | 'admin') => setRole(value)} defaultValue={role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" /> Send Invitations
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
