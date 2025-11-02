"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Image from 'next/image';
import { Folder } from 'lucide-react';

// Define the shape of the data prop this node expects
interface CollectionNodeData {
  label: string;
  thumbnail: string | null;
}

function CollectionNode({ data }: NodeProps<CollectionNodeData>) {
  return (
    // The main container with a blue accent border
    <div className="w-64 bg-background border-2 border-blue-500 rounded-lg shadow-md overflow-hidden">
      {/* Handles use the blue theme */}
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      
      <div className="relative h-24 bg-muted">
        {data.thumbnail ? (
          <Image src={data.thumbnail} alt={data.label} layout="fill" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* The fallback icon is always a Folder */}
            <Folder className="h-10 w-10 text-blue-500/70" />
          </div>
        )}
      </div>
      
      <div className="p-3">
        <p className="font-semibold text-sm text-foreground truncate">{data.label}</p>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  );
}

export default memo(CollectionNode);
