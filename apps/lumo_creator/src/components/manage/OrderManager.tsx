"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Folder, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define a common type for items in the list
interface SortableItem {
  _id: string;
  title: string;
  type: 'collection' | 'content';
}

// Draggable Item Component
function DraggableListItem({ item }: { item: SortableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center bg-background p-3 border rounded-lg shadow-sm"
    >
      <button {...listeners} {...attributes} className="cursor-grab touch-none p-2 mr-2 text-muted-foreground hover:bg-muted rounded">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-3">
        {item.type === 'collection' 
          ? <Folder className="h-5 w-5 text-blue-500" /> 
          : <FileText className="h-5 w-5 text-green-500" />
        }
        <span className="font-medium">{item.title}</span>
      </div>
    </div>
  );
}

// Main Order Manager Component
interface OrderManagerProps {
  initialCollections: SortableItem[];
  initialContent: SortableItem[];
  onOrderChange: (newOrder: { childCollections: string[], childContent: string[] }) => void;
}

export function OrderManager({ initialCollections, initialContent, onOrderChange }: OrderManagerProps) {
  const [collections, setCollections] = useState(initialCollections);
  const [content, setContent] = useState(initialContent);

  // Sync state if initial props change
  useEffect(() => {
    setCollections(initialCollections);
    setContent(initialContent);
  }, [initialCollections, initialContent]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Determine which list is being reordered
      const activeIsCollection = collections.some(c => c._id === active.id);
      const overIsCollection = collections.some(c => c._id === over.id);
      const activeIsContent = content.some(c => c._id === active.id);
      const overIsContent = content.some(c => c._id === over.id);

      let newCollectionsOrder = collections;
      let newContentOrder = content;

      if (activeIsCollection && overIsCollection) {
        const oldIndex = collections.findIndex((item) => item._id === active.id);
        const newIndex = collections.findIndex((item) => item._id === over.id);
        newCollectionsOrder = arrayMove(collections, oldIndex, newIndex);
        setCollections(newCollectionsOrder);
      } else if (activeIsContent && overIsContent) {
        const oldIndex = content.findIndex((item) => item._id === active.id);
        const newIndex = content.findIndex((item) => item._id === over.id);
        newContentOrder = arrayMove(content, oldIndex, newIndex);
        setContent(newContentOrder);
      }
      
      // Trigger the API call with the updated arrays
      onOrderChange({
        childCollections: newCollectionsOrder.map(c => c._id),
        childContent: newContentOrder.map(c => c._id),
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Collections Order</CardTitle>
          </CardHeader>
          <CardContent>
            {collections.length > 0 ? (
              <SortableContext items={collections.map(c => c._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {collections.map(item => <DraggableListItem key={item._id} item={item} />)}
                </div>
              </SortableContext>
            ) : <p className="text-muted-foreground">No collections to order.</p>}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Order</CardTitle>
          </CardHeader>
          <CardContent>
            {content.length > 0 ? (
              <SortableContext items={content.map(c => c._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {content.map(item => <DraggableListItem key={item._id} item={item} />)}
                </div>
              </SortableContext>
            ) : <p className="text-muted-foreground">No content to order.</p>}
          </CardContent>
        </Card>
      </div>
    </DndContext>
  );
}
