"use client";

import { useNode } from "@craftjs/core";
import { QuizOption, QuizProps } from "../QuizComponent";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";

export function QuizSettings() {
  const { actions: { setProp }, question, options, feedbackCorrect, feedbackIncorrect } = useNode((node) => ({
    question: node.data.props.question,
    options: node.data.props.options,
    feedbackCorrect: node.data.props.feedbackCorrect,
    feedbackIncorrect: node.data.props.feedbackIncorrect,
  }));

  const handleOptionChange = (index: number, newText: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: newText };
    setProp((props: QuizProps) => props.options = newOptions);
  };

  const handleCorrectChange = (index: number) => {
    const newOptions = options.map((opt: QuizOption, i: number) => ({
      ...opt,
      isCorrect: i === index
    }));
    setProp((props: QuizProps) => props.options = newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_: any, i: number) => i !== index);
    setProp((props: QuizProps) => props.options = newOptions);
  };

  const handleAddOption = () => {
    const newOptions = [...options, { text: "New Option", isCorrect: false }];
    setProp((props: QuizProps) => props.options = newOptions);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          value={question}
          onChange={(e) => setProp((props: QuizProps) => props.question = e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Options</Label>
        <div className="space-y-2 mt-1">
          {options.map((option: QuizOption, index: number) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
              <Checkbox
                checked={option.isCorrect}
                onCheckedChange={() => handleCorrectChange(index)}
              />
              <Input
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)} disabled={options.length <= 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAddOption} className="w-full mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="feedback-correct">"Correct" Feedback</Label>
          <Input
            id="feedback-correct"
            value={feedbackCorrect}
            onChange={(e) => setProp((props: QuizProps) => props.feedbackCorrect = e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="feedback-incorrect">"Incorrect" Feedback</Label>
          <Input
            id="feedback-incorrect"
            value={feedbackIncorrect}
            onChange={(e) => setProp((props: QuizProps) => props.feedbackIncorrect = e.target.value)}
            className="mt-1"
          />
           <p className="text-xs text-muted-foreground mt-1">Use {'{correctAnswer}'} to show the right answer text.</p>
        </div>
      </div>
    </div>
  );
}
