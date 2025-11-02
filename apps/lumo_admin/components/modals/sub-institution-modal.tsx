"use client"

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus } from "lucide-react";

// Define the shape of the institution object this modal expects
interface SubInstitution {
  id: string;
  name: string;
  owner: {
    email: string;
  };
  portalKey: string;
}

// Define the props for the modal
interface SubInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: SubInstitution | null; // Pass null for creating, or an object for editing
}

// GraphQL Mutations
const CREATE_SUB_INSTITUTION = gql`
  mutation CreateSubInstitution($input: CreateSubInstitutionInput!) {
    createSubInstitution(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_SUB_INSTITUTION = gql`
  mutation UpdateSubInstitution($input: UpdateSubInstitutionInput!) {
    updateSubInstitution(input: $input) {
      id
      name
    }
  }
`;

const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;

export function SubInstitutionModal({ isOpen, onClose, institution }: SubInstitutionModalProps) {
  const [name, setName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [portalKey, setPortalKey] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // This effect populates the form with data when the modal opens for editing,
  // and clears it when opening for creation.
  useEffect(() => {
    if (institution) {
      setName(institution.name);
      setOwnerEmail(institution.owner.email);
      setPortalKey(institution.portalKey);
    } else {
      setName('');
      setOwnerEmail('');
      setPortalKey('');
    }
  }, [institution, isOpen]);

  const createMutation = useMutation({
    mutationFn: (variables: { name: string; ownerEmail: string; portalKey: string }) =>
      request(GQL_API_ENDPOINT, CREATE_SUB_INSTITUTION, { input: variables }),
    onSuccess: () => {
      toast({ title: "Success", description: "Sub-institution created successfully." });
      queryClient.invalidateQueries({ queryKey: ['subInstitutions'] });
      onClose();
    },
    onError: (err: any) => {
      const errorMessage = err.response?.errors?.[0]?.message || "Failed to create.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { institutionId: string; name: string }) =>
      request(GQL_API_ENDPOINT, UPDATE_SUB_INSTITUTION, { input: variables }),
    onSuccess: () => {
      toast({ title: "Success", description: "Sub-institution updated successfully." });
      queryClient.invalidateQueries({ queryKey: ['subInstitutions'] });
      onClose();
    },
    onError: (err: any) => {
      const errorMessage = err.response?.errors?.[0]?.message || "Failed to update.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    if (institution) {
      // Edit Mode
      if (!name) {
        toast({ title: "Missing Name", description: "Institution name cannot be empty.", variant: "destructive" });
        return;
      }
      updateMutation.mutate({ institutionId: institution.id, name });
    } else {
      // Create Mode
      if (!name || !ownerEmail || !portalKey) {
        toast({ title: "Missing Fields", description: "Please fill out all fields.", variant: "destructive" });
        return;
      }
      createMutation.mutate({ name, ownerEmail, portalKey });
    }
  };

  const title = institution ? "Edit Sub-Institution" : "Create New Sub-Institution";
  const description = institution ? "Update the details for this institution." : "Fill in the details to create a new institution under your organization.";

  return (
    <Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 py-2 pb-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Institution Name</label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />
        </div>
        <div>
          <label htmlFor="ownerEmail" className="text-sm font-medium">Owner's Email Address</label>
          <Input id="ownerEmail" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} disabled={institution != null || isPending} />
          <p className="text-xs text-muted-foreground mt-1">The owner must already have a user account on the platform. This cannot be changed after creation.</p>
        </div>
         <div>
          <label htmlFor="portalKey" className="text-sm font-medium">Portal Key</label>
          <Input id="portalKey" value={portalKey} onChange={(e) => setPortalKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} disabled={institution != null || isPending} />
          <p className="text-xs text-muted-foreground mt-1">A unique key for their portal (e.g., 'acme-corp'). No spaces or special characters. Cannot be changed.</p>
        </div>
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button disabled={isPending} variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={isPending} onClick={handleSubmit}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {institution ? "Save Changes" : "Create Institution"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
