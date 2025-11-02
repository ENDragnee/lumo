import { RenderCanvas } from "@/components/editor-components/RenderCanvas"; // 1. ADD this import
import { ImageComponent } from "@/components/editor-components/ImageComponent";
import { TextComponent } from "@/components/editor-components/TextComponent";
import { VideoComponent } from "@/components/editor-components/VideoComponent";
import { SimulationComponent } from "@/components/editor-components/SimulationComponent";
import { SliderComponent } from '@/components/editor-components/SliderComponent';
import { QuizComponent } from '@/components/editor-components/QuizComponent';
import { ContainerComponent } from "@/components/editor-components/ContainerComponent";
import { TabsComponent } from '@/components/editor-components/TabsComponent';
import { TabPanelComponent } from '@/components/editor-components/TabPanelComponent';
import { TableComponent } from '@/components/editor-components/TableComponent';
import { TableRowComponent } from '@/components/editor-components/TableRowComponent';
import { TableCellComponent } from '@/components/editor-components/TableCellComponent';
import { FlashcardComponent } from '@/components/editor-components/FlashcardComponent';
import { CalloutComponent } from '@/components/editor-components/CalloutComponent';
import { TrueFalseQuestionComponent } from '@/components/editor-components/TrueFalseQuestionComponent';
import { AccordionComponent } from '@/components/editor-components/AccordionComponent';
import { CarouselComponent } from '@/components/editor-components/CarouselComponent';
import { CarouselSlideComponent } from '@/components/editor-components/CarouselSlideComponent';
import { MultipleChoiceQuestionComponent } from '@/components/editor-components/MultipleChoiceQuestionComponent';
import { ShortAnswerQuestionComponent } from "@/components/editor-components/ShortAnswerQuestionComponent";
import { ChallengeComponent } from "@/components/editor-components/ChallengeComponent";
import { ChallengeContentCanvas } from "@/components/editor-components/ChallengeContentCanvas";

export const editorResolver = {
  RenderCanvas: RenderCanvas,
  Image: ImageComponent,
  TextComponent: TextComponent,
  ContainerComponent: ContainerComponent,
  Video: VideoComponent,
  Quiz: QuizComponent,
  Simulation: SimulationComponent,
  Slider: SliderComponent,
  TabsComponent: TabsComponent,
  TabPanelComponent: TabPanelComponent,
  Table: TableComponent,
  TableRow: TableRowComponent,
  TableCell: TableCellComponent,
  Flashcard: FlashcardComponent,
  Callout: CalloutComponent,
  Accordion: AccordionComponent,
  CarouselComponent: CarouselComponent,
  CarouselSlideComponent: CarouselSlideComponent,
  ChallengeComponent: ChallengeComponent,
  ChallengeContentCanvas: ChallengeContentCanvas,
  TrueFalseQuestion: TrueFalseQuestionComponent,
  ShortAnswerQuestion: ShortAnswerQuestionComponent,
  MultipleChoiceQuestionComponent: MultipleChoiceQuestionComponent,
};
