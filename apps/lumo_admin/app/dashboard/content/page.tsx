"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { gql, request } from "graphql-request"
import { DataTable } from "@/components/data-table" // Your custom DataTable
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Plus, BookOpen, Users, TrendingUp, Edit, Trash2, Eye, Loader2, UploadCloud, ArrowDownToLine } from "lucide-react"
import Link from "next/link"
import { BulkActionBar } from "@/components/bulk-action-bar"


type FilterType = {
  type: "alphabetical" | "date" | "status",
  options?: string[]
}

// Type for a single column, matching your DataTable component's interface
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterConfig?: FilterType; 
  render?: (value: any, row: ContentModule) => React.ReactNode;
}

// Types for fetched data (no changes)
interface ContentModule {
  id: string;
  title: string;
  status: string;
  creationDate: string;
  engagementRate: number;
  category: string[];
  enrolledUsers: number;
}
interface ContentStats {
  totalContent: number;
  publishedCount: number;
  averageEngagement: number;
}
interface ContentPageData {
  getContentModules: ContentModule[];
  getContentStats: ContentStats;
}

// GraphQL Queries & Mutations (no changes)
const GET_CONTENT_PAGE_DATA = gql`
  query GetContentPageData {
    getContentModules { id, title, status, creationDate, engagementRate, category, enrolledUsers }
    getContentStats { totalContent, publishedCount, averageEngagement }
  }
`;
const DELETE_MODULES_MUTATION = gql`
  mutation DeleteContentModules($ids: [ID!]!) {
    deleteContentModules(ids: $ids)
  }
`;
const UPDATE_MODULES_STATUS = gql`
  mutation UpdateContentStatus($ids: [ID!]!, $isDraft: Boolean!) {
    updateContentStatus(ids: $ids, isDraft: $isDraft)
  }
`;


const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;

const fetchContentData = async (): Promise<ContentPageData> => {
  return request(GQL_API_ENDPOINT, GET_CONTENT_PAGE_DATA);
};

export default function ContentManagementPage() {
  const [selectedContent, setSelectedContent] = useState<ContentModule[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery<ContentPageData>({
    queryKey: ['contentManagement'],
    queryFn: fetchContentData,
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => request(GQL_API_ENDPOINT, DELETE_MODULES_MUTATION, { ids }),
    onSuccess: () => {
      toast({ title: "Success", description: "Content has been moved to trash." });
      queryClient.invalidateQueries({ queryKey: ['contentManagement'] });
      setSelectedContent([]);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: `Failed to delete content: ${error.message}`, variant: "destructive" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (variables: { ids: string[]; isDraft: boolean }) => 
      request(GQL_API_ENDPOINT, UPDATE_MODULES_STATUS, variables),
    onSuccess: (_, variables) => {
      const action = variables.isDraft ? "moved to drafts" : "published";
      toast({ title: "Success", description: `Content has been ${action}.` });
      queryClient.invalidateQueries({ queryKey: ['contentManagement'] });
      setSelectedContent([]);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: `Failed to update content status: ${error.message}`, variant: "destructive" });
    },
  });

  const columns: Column[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      filterConfig: {
        type: 'alphabetical',
      },
      render: (value: string, row: ContentModule) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.category.join(', ')}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterConfig: {
        type: 'status',
        options: ["Published", "Draft"]
      },
      render: (value: string) => <Badge variant={value === "Published" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "creationDate",
      label: "Creation Date",
      sortable: true,
      filterConfig: {
        type: 'date',
      },
      render: (value: string) => {
          if (!value) return "-";
          try {
              const date = new Date(isNaN(Number(value)) ? value : Number(value));
              return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
          } catch {
              return "Invalid Date";
          }
      },
    },
    {
      key: "engagementRate",
      label: "Engagement Rate",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${value}%` }} />
          </div>
          <span className="text-sm text-gray-600">{value}%</span>
        </div>
      ),
    },
    {
      key: "enrolledUsers",
      label: "Completions",
      sortable: true,
      render: (value: number) => value.toLocaleString(),
    },
  ];

  const handleRowSelect = (rows: ContentModule[]) => {
    setSelectedContent(rows);
  };

  const renderActions = (row: ContentModule) => (
    <>
      <DropdownMenuItem asChild>
        <Link href={`https://easy-learning-two.vercel.app/content/${row.id}`}><Eye className="w-4 h-4 mr-2" /> View</Link>
      </DropdownMenuItem>
      {row.status === 'Published' ? (
        <DropdownMenuItem className="text-red-600" onClick={() => handleToggleStatus(row.id, true)}>
          <ArrowDownToLine className="w-4 h-4 mr-2" /> Un-Publish
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem className="text-red-600" onClick={() => handleToggleStatus(row.id, false)}>
          <UploadCloud className="w-4 h-4 mr-2" /> Publish
        </DropdownMenuItem>
      )}
      <DropdownMenuItem asChild>
        <Link href={`https://lumo-creator.aasciihub.com/studio/${row.id}`}><Edit className="w-4 h-4 mr-2" /> Edit</Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="text-red-600" onClick={() => deleteMutation.mutate([row.id])}>
        <Trash2 className="w-4 h-4 mr-2" /> Delete
      </DropdownMenuItem>
    </>
  );

  const handleBulkDelete = () => {
    const idsToDelete = selectedContent.map(c => c.id);
    deleteMutation.mutate(idsToDelete);
  };

  // ✨ FIX: New handler to toggle status for a single item
  const handleToggleStatus = (moduleId: string, isCurrentlyPublished: boolean) => {
    statusMutation.mutate({ ids: [moduleId], isDraft: isCurrentlyPublished });
  };
  // ✨ FIX: Specific handlers for bulk publishing and unpublishing
  const handleBulkPublish = () => {
    const idsToUpdate = selectedContent.map(c => c.id);
    statusMutation.mutate({ ids: idsToUpdate, isDraft: false });
  };

  const handleBulkUnpublish = () => {
    const idsToUpdate = selectedContent.map(c => c.id);
    statusMutation.mutate({ ids: idsToUpdate, isDraft: true });
  };
  
  const handleBulkEdit = () => {
    console.log("Bulk editing content:", selectedContent);
    toast({ title: "In Progress", description: "Bulk edit functionality is not yet implemented." });
  }

  if (isLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load content data.</div>;

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Create, manage, and organize your educational content</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild><Link href="/dashboard/content/organize">Organize Modules</Link></Button>
          <Button asChild><Link href="https://lumo-creator.aasciihub.com"><Plus className="w-4 h-4 mr-2" /> Create Content</Link></Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle><BookOpen className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{data?.getContentStats.totalContent ?? 0}</div></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle><TrendingUp className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{data?.getContentStats.publishedCount ?? 0}</div></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle><Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{data?.getContentStats.averageEngagement ?? 0}%</div></CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ✨ FIX: The actions prop now passes an object with 'handler' and 'isLoading' properties for each action. */}
      {selectedContent.length > 0 && (
        <BulkActionBar
          selectedCount={selectedContent.length}
          onClear={() => setSelectedContent([])}
          actions={{
            edit: { handler: handleBulkEdit, isLoading: false },
            publish: { handler: handleBulkPublish, isLoading: statusMutation.isPending },
            unpublish: { handler: handleBulkUnpublish, isLoading: statusMutation.isPending },
            delete: { handler: handleBulkDelete, isLoading: deleteMutation.isPending },
          }}
          itemType="content"
        />
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Content Library</CardTitle>
            <CardDescription>Manage all your educational content modules and materials</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={data?.getContentModules || []}
              columns={columns}
              selectable={true}
              onRowSelect={handleRowSelect}
              actions={renderActions}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
