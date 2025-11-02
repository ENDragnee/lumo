"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { gql, request } from "graphql-request"
import { formatDistanceToNow } from 'date-fns'
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, UserPlus, Send, RefreshCw, Trash2, Mail, UserCheck, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { BulkActionBar } from "@/components/bulk-action-bar"
import { InviteUserModal } from "@/components/modals/invite-user-modal"
import { MessageUserModal } from "@/components/modals/message-user-modal"
import { options } from "pdfkit"

// Type for a single invitation row in the data table
interface InvitedUser {
  id: string;
  email: string;
  role: 'admin' | 'member';
  status: 'pending' | 'accepted' | 'expired';
  sentBy: {
    name: string;
    profileImage: string | null;
  };
  sentDate: string;
  expiresAt: string;
}

// ✨ --- NEW INTERFACES FOR STATS AND PAGE DATA --- ✨
interface InvitationStats {
  totalInvites: number;
  pendingCount: number;
  acceptedCount: number;
  expiredCount: number;
  pendingPercentage: number;
  acceptedPercentage: number;
}
interface InvitationPageData {
  getInvitationPageData: {
    stats: InvitationStats;
    invitations: InvitedUser[];
  };
}

// ✨ --- UPDATED GRAPHQL QUERY --- ✨
const GET_INVITATION_PAGE_DATA = gql`
  query GetInvitationPageData {
    getInvitationPageData {
      stats {
        totalInvites
        pendingCount
        acceptedCount
        expiredCount
        pendingPercentage
        acceptedPercentage
      }
      invitations {
        id
        email
        role
        status
        sentDate
        expiresAt
        sentBy { name, profileImage }
      }
    }
  }
`;

const REVOKE_INVITATION = gql`
  mutation RevokeInvitation($invitationId: ID!) {
    revokeInvitation(invitationId: $invitationId)
  }
`;

const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;

const fetchInvitationData = async (): Promise<InvitationPageData> => {
  return request(GQL_API_ENDPOINT, GET_INVITATION_PAGE_DATA);
};

export default function InvitationManagementPage() {
  const [selectedInvites, setSelectedInvites] = useState<InvitedUser[]>([]);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const [messageRecipients, setMessageRecipients] = useState<InvitedUser[]>([]);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useQuery<InvitationPageData>({
    queryKey: ['invitationPageData'],
    queryFn: fetchInvitationData,
  });

  const revokeMutation = useMutation({
    mutationFn: (invitationId: string) => 
      request(GQL_API_ENDPOINT, REVOKE_INVITATION, { invitationId }),
    onSuccess: () => {
      toast({ title: "Success", description: "The invitation has been revoked." });
      queryClient.invalidateQueries({ queryKey: ['invitationPageData'] });
      setSelectedInvites([]);
    },
    onError: (err: any) => {
      const errorMessage = err.response?.errors?.[0]?.message || "An unknown error occurred.";
      toast({ title: "Error", description: `Failed to revoke invitation: ${errorMessage}`, variant: 'destructive'});
    }
  });

  const handleRevoke = (invitationId: string) => {
    revokeMutation.mutate(invitationId);
  };

  const handleBulkRevoke = () => {
    selectedInvites.forEach(invite => {
      if (invite.status === 'pending') {
        handleRevoke(invite.id);
      }
    });
  };

  const handleOpenMessageModal = (users: InvitedUser[]) => {
    if (users.length === 0) return;
    setMessageRecipients(users);
    setMessageModalOpen(true);
  };

  const columns = [
    {
      key: "email",
      label: "Email",
      sortable: true,
      filterConfig: {
        type: 'alphabetical',
      },
      render: (email: string) => <p className="font-medium text-gray-900">{email}</p>,
    },
    {
      key: "sentBy",
      label: "Sent By",
      render: (sentBy: InvitedUser['sentBy']) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={sentBy.profileImage || undefined} />
            <AvatarFallback>{sentBy.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-gray-500">{sentBy.name}</p>
        </div>
      ),
    },
    {
      key: "sentDate",
      label: "Sent Date",
      sortable: true,
      filterConfig: {
        type: 'date',
      },
      render: (sentDate: string) => <span className="text-gray-500">{formatDistanceToNow(new Date(sentDate), { addSuffix: true })}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterConfig: {
        type: 'status',
        options: ['accepted', 'pending', 'expired']
      },
      render: (status: InvitedUser['status']) => {
        const variantMap = {
          accepted: 'default',
          pending: 'warning',
          expired: 'destructive',
        };
        return <Badge variant={variantMap[status] as any} className="capitalize">{status}</Badge>
      },
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (role: string) => <span className="capitalize text-gray-500">{role}</span>,
    },
  ];

  const renderActions = (row: InvitedUser) => (
    <>
      {row.status === "pending" && (
        <>
          <DropdownMenuItem>
            <RefreshCw className="w-4 h-4 mr-2" /> Resend Invite
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={() => handleRevoke(row.id)}>
            <Trash2 className="w-4 h-4 mr-2" /> Revoke Invite
          </DropdownMenuItem>
        </>
      )}
       <DropdownMenuItem onClick={() => handleOpenMessageModal([row])}>
          <Mail className="w-4 h-4 mr-2" /> Contact User
      </DropdownMenuItem>
    </>
  );

  if (isLoading) return <div className="p-6 flex justify-center items-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load invitation data. Error: {(error as Error).message}</div>;

  // ✨ --- UPDATED DATA DESTRUCTURING --- ✨
  const stats = data?.getInvitationPageData.stats;
  const invites = data?.getInvitationPageData.invitations || [];

  return (
    <>
      <InviteUserModal 
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['invitationPageData'] });
        }}
      />

      <MessageUserModal
        isOpen={isMessageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        recipients={messageRecipients}
      />
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invitation Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all sent user invitations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setInviteModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite New Users
            </Button>
          </div>
        </motion.div>

        {/* ✨ --- NEW STATS CARDS SECTION --- ✨ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
                <Send className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingCount ?? 0}</div>
                <p className="text-xs text-muted-foreground">{Math.round(stats?.pendingPercentage ?? 0)}% of total</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accepted Invites</CardTitle>
                <UserCheck className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.acceptedCount ?? 0}</div>
                <p className="text-xs text-muted-foreground">{Math.round(stats?.acceptedPercentage ?? 0)}% of total</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expired/Revoked</CardTitle>
                <XCircle className="w-4 h-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.expiredCount ?? 0}</div>
                <p className="text-xs text-muted-foreground">Represents expired or revoked invites</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {selectedInvites.length > 0 && 
          <BulkActionBar
            selectedCount={selectedInvites.length}
            onClear={() => setSelectedInvites([])}
            actions={{
              delete: { handler: handleBulkRevoke, isLoading: revokeMutation.isPending },
            }}
            itemType="invitations"
          />
        }

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Sent Invitations</CardTitle>
              <CardDescription>A log of all invitations sent to prospective users.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={invites}
                columns={columns as any}
                selectable
                onRowSelect={setSelectedInvites}
                actions={renderActions}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
