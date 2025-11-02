//@/app/home/manage/page.tsx
"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { RootState } from '@/app/store/store';
import { setManagerView, ManagerViewType } from '@/app/store/slices/managerViewSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Link as LinkIcon, ListOrdered, Rows, Projector } from "lucide-react";
import { ErrorFallback } from '@/components/error-fallback';
import { PrerequisiteGraphEditor } from '@/components/manage/PrerequisiteGraphEditor';
import { PrerequisiteListEditor } from '@/components/manage/PrerequisiteListEditor';
import { OrderManager } from '@/components/manage/OrderManager';
import { OrderListView } from '@/components/manage/OrderListView';
import { toast } from "sonner";

// --- UPDATED: A unified type for all items in the manager ---
export interface IManageItem {
  _id: string;
  title: string;
  prerequisites?: string[];
  thumbnail: string | null;
  type: 'collection' | 'content'; // Differentiates the item type
}
// This type remains for the Order components
export interface ICollectionOrderItem {
  _id: string;
  title: string;
  type: 'collection' | 'content';
}

// --- API Fetching Functions ---
const fetchCollections = async () => {
  const res = await fetch('/api/collections?parentId=null');
  if (!res.ok) throw new Error('Failed to fetch collections');
  return (await res.json()).data;
};

// Renamed and updated to fetch a combined dependency graph
const fetchDependencyGraph = async (collectionId: string) => {
  if (!collectionId) return [];
  const res = await fetch(`/api/collections/${collectionId}/dependency-graph`);
  if (!res.ok) throw new Error('Failed to fetch dependency graph');
  return (await res.json()).data as IManageItem[];
};

// Fetches detailed data for the ordering tab
const fetchCollectionDetails = async (collectionId: string) => {
  if (!collectionId) return null;
  const res = await fetch(`/api/collections/${collectionId}`);
  if (!res.ok) throw new Error('Failed to fetch collection details');
  return (await res.json()).data;
};

// Updated mutation function to handle both collections and content
const updatePrerequisites = async ({ id, type, prerequisites }: { id: string, type: 'collection' | 'content', prerequisites: string[] }) => {
  const endpoint = type === 'collection' 
    ? `/api/collections/${id}/prerequisites` 
    : `/api/content/${id}/prerequisites`;
  
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prerequisites }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update prerequisites');
  return res.json();
};

// Mutation function for updating order (no changes needed)
const updateOrder = async ({ collectionId, childCollections, childContent }: { collectionId: string, childCollections: string[], childContent: string[] }) => {
  const res = await fetch(`/api/collections/${collectionId}/order`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ childCollections, childContent }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update order');
  return res.json();
};

export default function ManageContentPage() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [activeMode, setActiveMode] = useState<'prerequisites' | 'order'>('prerequisites');
  const queryClient = useQueryClient();
  
  const dispatch = useAppDispatch();
  const activeView = useAppSelector((state: RootState) => state.managerView.viewType);

  // Data fetching queries
  const { data: collections, isLoading: isLoadingCollections } = useQuery({ queryKey: ['collectionsList'], queryFn: fetchCollections });
  
  const { data: dependencyItems, isLoading: isLoadingGraph, isError: isGraphError, error: graphError, refetch: refetchGraph } = useQuery({
    queryKey: ['dependencyGraph', selectedCollectionId],
    queryFn: () => fetchDependencyGraph(selectedCollectionId),
    enabled: !!selectedCollectionId && activeMode === 'prerequisites',
  });

  const { data: collectionDetails, isLoading: isLoadingDetails, isError: isDetailsError, error: detailsError, refetch: refetchDetails } = useQuery({
    queryKey: ['collectionDetails', selectedCollectionId],
    queryFn: () => fetchCollectionDetails(selectedCollectionId),
    enabled: !!selectedCollectionId && activeMode === 'order',
  });
  
  // Data mutation hooks
  const prereqMutation = useMutation({
    mutationFn: updatePrerequisites,
    onSuccess: () => {
      toast.success('Prerequisites updated!');
      queryClient.invalidateQueries({ queryKey: ['dependencyGraph', selectedCollectionId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
  
  const orderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      toast.success('Order updated!');
      queryClient.invalidateQueries({ queryKey: ['collectionDetails', selectedCollectionId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handlePrerequisitesChange = (id: string, type: 'collection' | 'content', prerequisites: string[]) => {
    prereqMutation.mutate({ id, type, prerequisites });
  };
  
  const handleOrderChange = (newOrder: { childCollections: string[], childContent: string[] }) => {
    if (orderMutation.isPending) return;
    orderMutation.mutate({ collectionId: selectedCollectionId, ...newOrder });
  };
  
  const isLoading = isLoadingCollections || (activeMode === 'prerequisites' && isLoadingGraph) || (activeMode === 'order' && isLoadingDetails);
  const isError = (activeMode === 'prerequisites' && isGraphError) || (activeMode === 'order' && isDetailsError);
  const error = graphError || detailsError;
  const refetch = activeMode === 'prerequisites' ? refetchGraph : refetchDetails;

  const handleViewChange = (value: ManagerViewType) => {
    if (value) dispatch(setManagerView(value));
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    if (isError) {
      return <ErrorFallback error={error} onRetry={refetch} />;
    }
    
    if (activeMode === 'prerequisites') {
      return activeView === 'visual'
        ? <PrerequisiteGraphEditor items={dependencyItems || []} onPrerequisitesChange={handlePrerequisitesChange} />
        : <PrerequisiteListEditor items={dependencyItems || []} onPrerequisitesChange={handlePrerequisitesChange} />;
    }
    
    if (activeMode === 'order') {
      const collections = (collectionDetails?.childCollections || []).map((c: any) => ({...c, type: 'collection'}));
      const content = (collectionDetails?.childContent || []).map((c: any) => ({...c, type: 'content'}));
      
      return activeView === 'visual'
        ? <OrderManager initialCollections={collections} initialContent={content} onOrderChange={handleOrderChange} />
        : <OrderListView collections={collections} content={content} />;
    }
    
    return null;
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
          <p className="text-muted-foreground">Organize your content's prerequisites and sequence.</p>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Select a Collection</label>
          <Select onValueChange={setSelectedCollectionId} value={selectedCollectionId}>
            <SelectTrigger className="w-full md:w-[280px]"><SelectValue placeholder="Choose a collection..." /></SelectTrigger>
            <SelectContent>
              {isLoadingCollections ? <div className="p-4 text-center">Loading...</div> : 
                collections?.map((col: any) => <SelectItem key={col._id} value={col._id}>{col.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedCollectionId ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)} className="w-full md:w-auto">
              <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                <TabsTrigger value="prerequisites"><LinkIcon className="h-4 w-4 mr-2"/>Prerequisites</TabsTrigger>
                <TabsTrigger value="order"><ListOrdered className="h-4 w-4 mr-2"/>Order</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <ToggleGroup type="single" value={activeView} onValueChange={handleViewChange} aria-label="View Type">
              <ToggleGroupItem value="visual" aria-label="Visual view">
                <Projector className="h-4 w-4 mr-2" />
                Visual
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <Rows className="h-4 w-4 mr-2" />
                List View
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="pt-4">
            {renderContent()}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
          <p className="text-lg text-muted-foreground">Please select a collection to begin.</p>
        </div>
      )}
    </div>
  );
}
