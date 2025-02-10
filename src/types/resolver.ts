import { TextViewerComponent } from '@/components/widgets/text-widget';
import { Element } from "@craftjs/core"
import { InlineMath, BlockMath } from 'react-katex';
import QuizQuestion from '@/components/QuizQuestion';
import 'katex/dist/katex.min.css';

export const viewerResolver = {
    TextComponent: TextViewerComponent,
    // SliderComponent: CraftSliderWidget,
    // QuizComponent: CraftQuizWidget,
    // VideoComponent: CraftVideoWidget,
    // ImageComponent: CraftImageWidget,
    BlockMath,
    InlineMath,
    QuizQuestion,
    Element
}