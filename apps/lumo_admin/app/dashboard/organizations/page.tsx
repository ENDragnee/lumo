"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { gql, request } from "graphql-request"
import { format } from 'date-fns'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Loader2, MoreVertical, Building, Users, Clock, ShieldCheck, AlertCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ErrorFallback } from "@/components/error-fallback"
import { SubInstitutionModal } from "@/components/modals/sub-institution-modal" // ✨ IMPORT THE NEW MODAL
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface SubInstitution {
  id: string;
  name: string;
  owner: {
    name: string;
    email: string;
    profileImage: string | null;
  };
  memberCount: number;
  createdAt: string;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled';
  portalKey: string;
}

interface SubInstitutionPageData {
  getSubInstitutions: SubInstitution[];
}

// GraphQL Queries & Mutations
const GET_SUB_INSTITUTIONS = gql`
  query GetSubInstitutions {
    getSubInstitutions {
      id
      name
      owner { name, email, profileImage }
      memberCount
      createdAt
      subscriptionStatus
      portalKey
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateSubInstitutionStatus($input: UpdateSubInstitutionStatusInput!) {
    updateSubInstitutionStatus(input: $input) { id, subscriptionStatus }
  }
`;

const DELETE_SUB_INSTITUTION = gql`
  mutation DeleteSubInstitution($institutionId: ID!) {
    deleteSubInstitution(institutionId: $institutionId)
  }
`;

const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;

const fetchSubInstitutions = async (): Promise<SubInstitutionPageData> => {
  return request(GQL_API_ENDPOINT, GET_SUB_INSTITUTIONS);
};

export default function OrganizationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<SubInstitution | null>(null);
  const [deletingInstitution, setDeletingInstitution] = useState<SubInstitution | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useQuery<SubInstitutionPageData>({
    queryKey: ['subInstitutions'],
    queryFn: fetchSubInstitutions,
  });

  // Type definitions for the status mutation hook
  type UpdateStatusData = { updateSubInstitutionStatus: { id: string; subscriptionStatus: string } };
  type UpdateStatusVariables = { institutionId: string; status: string };

  const statusMutation = useMutation<UpdateStatusData, Error, UpdateStatusVariables>({
    mutationFn: (variables) => request(GQL_API_ENDPOINT, UPDATE_STATUS, { input: variables }),
    onSuccess: (data) => {
      toast({ title: "Success", description: `Institution status updated to ${data.updateSubInstitutionStatus.subscriptionStatus}.` });
      queryClient.invalidateQueries({ queryKey: ['subInstitutions'] });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.errors?.[0]?.message || "Failed to update status.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (institutionId: string) =>
      request(GQL_API_ENDPOINT, DELETE_SUB_INSTITUTION, { institutionId }),
    onSuccess: () => {
      toast({ title: "Success", description: "Sub-institution has been permanently deleted." });
      queryClient.invalidateQueries({ queryKey: ['subInstitutions'] });
      setDeletingInstitution(null); // Close the dialog
    },
    onError: (err: any) => {
      const errorMessage = err.response?.errors?.[0]?.message || "Failed to delete sub-institution.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  });


  const handleUpdateStatus = (institutionId: string, status: string) => {
    statusMutation.mutate({ institutionId, status });
  };
  
  const getStatusProps = (status: SubInstitution['subscriptionStatus']) => {
    switch (status) {
      case 'active': return { variant: 'default', icon: <ShieldCheck className="w-4 h-4 text-green-500"/>, label: 'Active' };
      case 'trialing': return { variant: 'secondary', icon: <Clock className="w-4 h-4 text-blue-500"/>, label: 'Trialing' };
      case 'past_due': return { variant: 'warning', icon: <AlertCircle className="w-4 h-4 text-yellow-500"/>, label: 'Past Due' };
      case 'canceled': return { variant: 'destructive', icon: <XCircle className="w-4 h-4 text-red-500"/>, label: 'Canceled' };
      default: return { variant: 'secondary', icon: <AlertCircle className="w-4 h-4"/>, label: 'Unknown' };
    }
  };

  const handleOpenCreateModal = () => {
    setEditingInstitution(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (institution: SubInstitution) => {
    setEditingInstitution(institution);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingInstitution) {
      deleteMutation.mutate(deletingInstitution.id);
    }
  };

  if (isLoading) return <div className="p-6 flex justify-center items-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>;
  if (isError) return <ErrorFallback error={error as Error} onRetry={() => queryClient.invalidateQueries({ queryKey: ['subInstitutions'] })} />;

  const subInstitutions = data?.getSubInstitutions || [];

  return (
    <>
      <SubInstitutionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        institution={editingInstitution} 
      />

       <AlertDialog open={!!deletingInstitution} onOpenChange={(isOpen) => !isOpen && setDeletingInstitution(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="font-bold"> {deletingInstitution?.name}</span> institution and all of its associated data, including users, content, and performance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="text-red-500 focus:bg-red-50 focus:text-red-600"
              disabled={deleteMutation.isPending}
              onClick={handleDeleteConfirm}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="p-4 md:p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all sub-institutions under your parent organization.</p>
          </div>
          <Button onClick={handleOpenCreateModal}>
            <Plus className="mr-2 h-4 w-4" /> Create Sub-Institution
          </Button>
        </motion.div>

        {subInstitutions.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-gray-50 dark:bg-card rounded-lg">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No sub-institutions found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new sub-institution.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {subInstitutions.map((inst) => {
              const statusProps = getStatusProps(inst.subscriptionStatus);
              return (
              <motion.div key={inst.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{inst.name}</CardTitle>
                      <CardDescription>Created {format(new Date(inst.createdAt), 'MMMM d, yyyy')}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEditModal(inst)}>Edit Details</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(inst.id, 'active')}>Set Active</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(inst.id, 'trialing')}>Set Trialing</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(inst.id, 'past_due')}>Set Past Due</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(inst.id, 'canceled')}>Set Canceled</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem 
                          className="text-red-500 focus:bg-red-50 focus:text-red-600"
                          onClick={() => setDeletingInstitution(inst)}
                        >
                        Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <div className="flex items-center gap-2">
                        {statusProps.icon}
                        <Badge variant={statusProps.variant as any} className="capitalize">{statusProps.label}</Badge>
                     </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50/50 dark:bg-gray-900/50 p-4 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4"/>
                      <span>{inst.memberCount} Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={inst.owner.profileImage || undefined} />
                        <AvatarFallback>{inst.owner.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[100px]">{inst.owner.name}</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )})}
          </motion.div>
        )}
      </div>
    </>
  )
}
