"use client";

import React, { useState, useMemo, useCallback, useEffect, MouseEvent } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  applyEdgeChanges,
  applyNodeChanges,
  EdgeMouseHandler,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { IManageItem } from '@/app/home/manage/page';
import { useAppSelector } from '@/app/store/hooks';
import { RootState } from '@/app/store/store';
import { cn } from '@/lib/utils';
import { EditorToolbar } from './EditorToolbar';
// --- UPDATED: Import the new, specific node components ---
import CollectionNode from './CollectionNode';
import ContentNode from './ContentNode';

interface PrerequisiteGraphEditorProps {
  items: IManageItem[];
  onPrerequisitesChange: (id: string, type: 'collection' | 'content', prerequisites: string[]) => void;
}

export function PrerequisiteGraphEditor({ items, onPrerequisitesChange }: PrerequisiteGraphEditorProps) {
  // --- UPDATED: Register both node types with React Flow ---
  const nodeTypes = useMemo(() => ({
    collection: CollectionNode,
    content: ContentNode,
  }), []);

  const activeTool = useAppSelector((state: RootState) => state.managerTool.tool);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  useEffect(() => {
    const newNodes: Node[] = items.map((item: IManageItem, index: number) => ({
      id: item._id,
      // --- UPDATED: Dynamically assign the node type based on the item's type ---
      type: item.type, // This will be either 'collection' or 'content'
      position: { x: (index % 5) * 280, y: Math.floor(index / 5) * 180 },
      data: { 
        label: item.title, 
        thumbnail: item.thumbnail,
      },
    }));

    const newEdges: Edge[] = [];
    items.forEach((item: IManageItem) => {
      item.prerequisites?.forEach((prereqId: string) => {
        if (items.some((n: IManageItem) => n._id === prereqId)) {
          newEdges.push({
            id: `e-${prereqId}-${item._id}`,
            source: prereqId,
            target: item._id,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          });
        }
      });
    });
    setNodes(newNodes);
    setEdges(newEdges);
  }, [items]);

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onConnect = useCallback((params: Connection | Edge) => {
    if (activeTool !== 'connect') return;
    if (params.source === params.target) return;
    const newEdge = { ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } };
    setEdges((eds) => addEdge(newEdge, eds));
    
    const targetNode = items.find((item: IManageItem) => item._id === params.target);
    if (targetNode && params.source) {
      const newPrerequisites = [...new Set([...(targetNode.prerequisites || []), params.source])];
      onPrerequisitesChange(targetNode._id, targetNode.type, newPrerequisites);
    }
  }, [items, onPrerequisitesChange, activeTool]);

  const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
    const updates = edgesToDelete.reduce((acc: Record<string, Set<string>>, edge: Edge) => {
        const targetId = edge.target;
        const sourceId = edge.source;
        if (!acc[targetId]) {
          const targetNode = items.find((item: IManageItem) => item._id === targetId);
          acc[targetId] = new Set(targetNode?.prerequisites || []);
        }
        acc[targetId].delete(sourceId);
        return acc;
      }, {} as Record<string, Set<string>>);

    Object.entries(updates).forEach(([targetId, newPrerequisitesSet]) => {
      const targetNode = items.find((item: IManageItem) => item._id === targetId);
      if (targetNode) {
        const newPrerequisitesArray = Array.from(newPrerequisitesSet);
        onPrerequisitesChange(targetId, targetNode.type, newPrerequisitesArray);
      }
    });
  }, [items, onPrerequisitesChange]);

  const handleEdgeClick: EdgeMouseHandler = useCallback((_event: MouseEvent, edge: Edge) => {
    if (activeTool === 'delete') {
      onEdgesDelete([edge]);
    }
  }, [activeTool, onEdgesDelete]);

  return (
    <div className="h-[70vh] w-full border rounded-lg bg-background shadow-inner relative">
      <EditorToolbar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={activeTool === 'connect'}
        nodesConnectable={activeTool === 'connect'}
        elementsSelectable={activeTool === 'connect'}
        className={cn(activeTool === 'delete' && 'delete-cursor')}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
