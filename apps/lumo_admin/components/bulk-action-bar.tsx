// @/components/bulk-action-bar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { X, Check, Trash2, Mail, Download } from "lucide-react"

// Define a flexible type for actions
type ActionHandler = {
  handler: () => void;
  isLoading?: boolean;
};

// ✨ FIX: Add the onClear prop to the interface
interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions: {
    publish?: ActionHandler;
    unpublish?: ActionHandler;
    approve?: ActionHandler;
    edit?: ActionHandler;
    reject?: ActionHandler;
    delete?: ActionHandler;
    message?: () => void; // Can be simple if no loading state
    export?: () => void;
  };
  itemType?: string;
  selectedItems?: any[]; // Keep for potential future use
}

export function BulkActionBar({
  selectedCount,
  onClear,
  actions,
  itemType = "items",
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-700" onClick={onClear}>
            <X className="w-5 h-5" />
          </Button>
          <span className="font-medium">{selectedCount} {itemType} selected</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actions.approve && (
          <Button size="sm" variant="secondary" onClick={actions.approve.handler} disabled={actions.approve.isLoading}>
            <Check className="w-4 h-4 mr-2" /> Approve
          </Button>
        )}
        {actions.reject && (
          <Button size="sm" variant="destructive" onClick={actions.reject.handler} disabled={actions.reject.isLoading}>
            <X className="w-4 h-4 mr-2" /> Reject
          </Button>
        )}
        {actions.delete && (
          <Button size="sm" variant="destructive" onClick={actions.delete.handler} disabled={actions.delete.isLoading}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        )}
         {actions.message && (
          <Button size="sm" variant="outline" className="bg-transparent border-gray-600 hover:bg-gray-800" onClick={actions.message}>
            <Mail className="w-4 h-4 mr-2" /> Message
          </Button>
        )}
        {actions.export && (
          <Button size="sm" variant="outline" className="bg-transparent border-gray-600 hover:bg-gray-800" onClick={actions.export}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        )}
      </div>
    </div>
  )
}
