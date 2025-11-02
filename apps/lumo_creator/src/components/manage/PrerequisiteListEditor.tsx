"use client";

import Select from 'react-select';
import { IManageItem } from '@/app/home/manage/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, FileText } from "lucide-react";

interface PrerequisiteListEditorProps {
  items: IManageItem[];
  onPrerequisitesChange: (id: string, type: 'collection' | 'content', prerequisites: string[]) => void;
}

export function PrerequisiteListEditor({ items, onPrerequisitesChange }: PrerequisiteListEditorProps) {
  
  // Create the options for the dropdown, including the item type
  const getOptions = (currentItemId: string) => {
    return items
      .filter(item => item._id !== currentItemId)
      .map(item => ({ 
        value: item._id, 
        label: item.title,
        type: item.type // Include type for custom rendering
      }));
  };

  // Custom component to render options in the dropdown with an icon
  const formatOptionLabel = ({ label, type }: { label: string, value: string, type: 'collection' | 'content' }) => (
    <div className="flex items-center">
      {type === 'collection' 
        ? <Folder className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" /> 
        : <FileText className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
      }
      <span>{label}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No items in this collection to manage.</p>
        </div>
      )}
      {items.map(item => (
        <Card key={item._id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {item.type === 'collection' 
                ? <Folder className="h-5 w-5 text-blue-500" /> 
                : <FileText className="h-5 w-5 text-green-500" />
              }
              {item.title}
            </CardTitle>
            <CardDescription>Select one or more prerequisites for this {item.type}.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              isMulti
              options={getOptions(item._id)}
              formatOptionLabel={formatOptionLabel} // Use the custom renderer
              value={item.prerequisites?.map(id => {
                const prereqItem = items.find(c => c._id === id);
                return { 
                  value: id, 
                  label: prereqItem?.title || 'Unknown Item', 
                  type: prereqItem?.type || 'content' // Default to content if not found
                };
              })}
              onChange={(selectedOptions) => {
                const newPrerequisites = selectedOptions.map(option => option.value);
                // Pass the item's ID, its type, and the new list of prerequisites
                onPrerequisitesChange(item._id, item.type, newPrerequisites);
              }}
              // It's recommended to add some basic styling for react-select
              // For example, in your globals.css:
              // .react-select__control { border-color: hsl(var(--border)); }
              // .react-select__multi-value { background-color: hsl(var(--secondary)); }
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
