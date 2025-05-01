// src/types/viewerResolver.ts

// No need to import React if basicHtmlResolver is removed and viewer components don't use JSX directly here

import { ImageComponentViewer } from '@/components/widgets/ImageComponentViewer'; // Adjust path if needed
import { TextViewerComponent } from '@/components/widgets/TextViewerComponent';   // Adjust path if needed
import { VideoComponentViewer } from '@/components/widgets/VideoComponentViewer'; // Adjust path if needed
import { SimulationComponentViewer } from '@/components/widgets/SimulationComponentViewer'; // Adjust path if needed
import { SimpleContainerViewer } from '@/components/widgets/SimpleContainerViewer'; // Adjust path as needed
import { HeaderViewerComponent } from '@/components/widgets/HeaderViewerComponent';
import { FooterViewerComponent } from '@/components/widgets/FooterViewerComponent';
// ... import other viewer components ...


// *** Remove the basicHtmlResolver constant definition entirely ***


export const viewerResolver = {
  // Map your custom editor component names to their viewer components
  renderCanvas: SimpleContainerViewer, // Map the editor's canvas name to the simple viewer
  Image: ImageComponentViewer,
  Text: TextViewerComponent,
  Video: VideoComponentViewer,
  Simulation: SimulationComponentViewer,
  Header: HeaderViewerComponent,
  Footer: FooterViewerComponent,
  // Quiz: QuizViewer, // Add mappings for all your components
};
