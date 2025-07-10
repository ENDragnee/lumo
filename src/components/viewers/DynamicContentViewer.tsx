// /components/viewers/DynamicContentViewer.tsx (Refactored from ContentRenderer.tsx)
'use client';

import { Editor, Frame } from '@craftjs/core';
import { viewerResolver } from '@/types/resolver';

const componentResolver = {
  ...viewerResolver,
};

interface DynamicContentViewerProps {
  // It only needs the serialized JSON data to render.
  data: string;
}

export function DynamicContentViewer({ data }: DynamicContentViewerProps) {
  // We add a key here based on the data to force a re-render
  // if the user navigates between two different dynamic pages.
  return (
    <div className="bg-white dark:bg-slate-900 p-1 md:p-4 rounded-lg shadow-inner border border-gray-200 dark:border-slate-700 dark:text-white text-black">
      <Editor
        enabled={false}
        resolver={componentResolver}
        key={data} 
      >
        <Frame data={data} />
      </Editor>
    </div>
  );
}
