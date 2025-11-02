import { Type, Image, Video, Sliders, HelpCircle, Bot, LineChart } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Widget {
  icon: LucideIcon
  label: string
}

export const basicWidgets: Widget[] = [
  { icon: Type, label: "Text Box" },
  { icon: Image, label: "Image" },
  { icon: Video, label: "Video" },
]

export const interactiveWidgets: Widget[] = [
  { icon: Sliders, label: "Slider" },
  { icon: HelpCircle, label: "Quiz" },
]

export const advancedWidgets: Widget[] = [
  { icon: Bot, label: "AI Tutor" },
  { icon: LineChart, label: "Progress Tracker" },
]

