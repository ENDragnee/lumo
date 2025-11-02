"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Image from 'next/image';
import { Folder, FileText } from 'lucide-react';

// Define the shape of the data prop for clarity
interface CustomNodeData {
  label: string;
  thumbnail: string | null;
  type: 'collection' | 'content';
}

function CustomNode({ data }: NodeProps<CustomNodeData>) {
  return (
    <div className="w-64 bg-background border-2 border-border rounded-lg shadow-md overflow-hidden">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <div className="relative h-24 bg-muted">
        {data.thumbnail ? (
          <Image src={data.thumbnail} alt={data.label} layout="fill" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* --- NEW: Display icon based on type --- */}
            {data.type === 'collection' 
              ? <Folder className="h-10 w-10 text-muted-foreground" /> 
              : <FileText className="h-10 w-10 text-muted-foreground" />
            }
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-foreground truncate">{data.label}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
}

export default memo(CustomNode);
