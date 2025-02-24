import { TextViewerComponent } from '@/components/widgets/text-widget';
import { Element } from "@craftjs/core"
import { InlineMath, BlockMath } from 'react-katex';
import QuizQuestion from '@/components/QuizQuestion';
import 'katex/dist/katex.min.css';
import { ViewerCanvas } from '@/components/canvas';
import { VideoComponentViewer } from "@/components/widgets/video"
import { ImageComponentViewer } from "@/components/widgets/image"

export const viewerResolver = {
    renderCanvas: ViewerCanvas,
    Text: TextViewerComponent,
    // SliderComponent: CraftSliderWidget,
    // QuizComponent: CraftQuizWidget,
    Video: VideoComponentViewer,
    Image: ImageComponentViewer,
    BlockMath,
    InlineMath,
    QuizQuestion,
    Element
}