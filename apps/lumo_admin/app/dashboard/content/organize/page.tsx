"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { gql, request } from "graphql-request"
import { CourseBuilder, Module as CourseBuilderModule } from "@/components/course-builder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Loader2, BookOpen, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Type Definitions
type ModuleData = CourseBuilderModule; 

interface OrganizeDataResponse {
  getContentModules: ModuleData[];
}

// GraphQL Queries and Mutations (no changes)
const GET_MODULES_FOR_ORGANIZE = gql`
  query GetContentModulesForOrganize {
    getContentModules { id, title, description, status, order, enrolledUsers }
  }
`;
const UPDATE_CONTENT_ORDER = gql`
  mutation UpdateContentOrder($orderedIds: [ID!]!) {
    updateContentOrder(orderedIds: $orderedIds)
  }
`;
const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;

// Fetcher function (no changes)
const fetchOrganizeModules = async (): Promise<OrganizeDataResponse> => {
  return request(GQL_API_ENDPOINT, GET_MODULES_FOR_ORGANIZE);
};

export default function OrganizeContentPage() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  // Fetch initial data using React Query (no changes)
  const { data, isLoading, isError, error } = useQuery<OrganizeDataResponse>({
    queryKey: ['organizeContent'],
    queryFn: fetchOrganizeModules,
  });

  // ==========================================================
  // ✨ FIX: Implement Optimistic UI Update in the mutation
  // ==========================================================
  const updateOrderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => request(GQL_API_ENDPOINT, UPDATE_CONTENT_ORDER, { orderedIds }),
    
    // 1. onMutate is called BEFORE the mutation runs.
    onMutate: async (newOrderedIds: string[]) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['organizeContent'] });

      // Snapshot the previous value
      const previousModules = queryClient.getQueryData<OrganizeDataResponse>(['organizeContent']);
      
      // Manually create the new state based on the reordered modules array
      const newOptimisticData = {
        getContentModules: modules.map((module, index) => ({
          ...module,
          order: index, // Ensure the order property is also updated
        })),
      };

      // Optimistically update to the new value in the React Query cache
      queryClient.setQueryData<OrganizeDataResponse>(['organizeContent'], newOptimisticData);

      // Return a context object with the snapshotted value
      return { previousModules };
    },
    
    // 2. onError is called if the mutation fails.
    onError: (err, newOrderedIds, context) => {
      const errorMessage = (err as any).response?.errors?.[0]?.message || "An unknown error occurred.";
      toast({ title: "Error", description: `Failed to save order: ${errorMessage}`, variant: "destructive" });
      
      // Rollback to the previous value if the mutation fails
      if (context?.previousModules) {
        queryClient.setQueryData<OrganizeDataResponse>(['organizeContent'], context.previousModules);
      }
    },
    
    // 3. onSettled is always called after the mutation is done (success or error).
    onSettled: () => {
      // Invalidate the query to ensure we have the freshest data from the server.
      queryClient.invalidateQueries({ queryKey: ['organizeContent'] });
    },
  });

  // ✨ FIX: useEffect now simply syncs the local state with the React Query cache.
  // This is much more reliable and removes the need for `hasChanges`.
  useEffect(() => {
    if (data?.getContentModules) {
      setModules(data.getContentModules);
    }
  }, [data]);

  // Handler for when the user reorders items in the CourseBuilder
  const handleReorder = (newOrder: ModuleData[]) => {
    // Immediately update the local state for a snappy UI response
    setModules(newOrder);
  };

  // Handler for the save button
  const handleSave = () => {
    // The "Save" button is now only enabled if the local state differs from the cached state.
    const orderedIds = modules.map(m => m.id);
    updateOrderMutation.mutate(orderedIds);
  };
  
  // Handlers for now, to be implemented with mutations
  const handleAddModule = () => toast({ title: "Info", description: "Create new modules from the main Content Management page." });
  const handleDeleteModule = (moduleId: string) => toast({ title: "Info", description: `Delete module ${moduleId} from the main Content Management page.` });

  // Determine if there are changes by comparing local state to cached data
  const hasUnsavedChanges = JSON.stringify(modules.map(m => m.id)) !== JSON.stringify(data?.getContentModules.map(m => m.id) ?? []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Failed to load module data.</p>
        <p className="text-sm">{(error as Error)?.message}</p>
      </div>
    );
  }

  const overviewStats = {
    totalModules: modules.length,
    published: modules.filter(m => m.status === 'Published').length,
    totalDuration: modules.reduce((acc, m) => acc + (m.duration || 0), 0),
    totalEnrolled: modules.reduce((acc, m) => acc + (m.enrolledUsers || 0), 0),
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/content"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Content</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organize Course Modules</h1>
            <p className="text-gray-600 mt-1">Drag and drop to reorder your course content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && <span className="text-sm text-orange-600 font-medium animate-pulse">Unsaved changes</span>}
          <Button onClick={handleSave} disabled={!hasUnsavedChanges || updateOrderMutation.isPending}>
            {updateOrderMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Order
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>Tax Compliance and Business Registration Course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-2 rounded-lg bg-gray-50"><div className="text-2xl font-bold text-blue-600">{overviewStats.totalModules}</div><p className="text-sm text-gray-600">Total Modules</p></div>
              <div className="text-center p-2 rounded-lg bg-gray-50"><div className="text-2xl font-bold text-green-600">{overviewStats.published}</div><p className="text-sm text-gray-600">Published</p></div>
              <div className="text-center p-2 rounded-lg bg-gray-50"><div className="text-2xl font-bold text-orange-600">{overviewStats.totalDuration} min</div><p className="text-sm text-gray-600">Total Duration</p></div>
              <div className="text-center p-2 rounded-lg bg-gray-50"><div className="text-2xl font-bold text-purple-600">{overviewStats.totalEnrolled.toLocaleString()}</div><p className="text-sm text-gray-600">Total Completions</p></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <CourseBuilder
          modules={modules}
          onReorder={handleReorder}
          onAddModule={handleAddModule}
          onEditModule={(id) => { router.push(`/dashboard/content/${id}/edit`) }}
          onDeleteModule={handleDeleteModule}
        />
      </motion.div>
    </div>
  )
}
