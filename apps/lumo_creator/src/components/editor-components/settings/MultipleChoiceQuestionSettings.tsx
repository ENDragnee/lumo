"use client";

import React from 'react';
import { useNode } from '@craftjs/core';
import { MultipleChoiceQuestionProps, QuestionOption } from '../MultipleChoiceQuestionComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from 'lucide-react';

export const MultipleChoiceQuestionSettings = () => {
  const {
    actions: { setProp },
    title, prompt, instruction, allowMultipleAnswers, options, feedbackCorrect, feedbackIncorrect, buttonText
  } = useNode<MultipleChoiceQuestionProps>(node => node.data.props);

  const handleOptionTextChange = (index: number, newText: string) => {
    const newOptions = [...(options || [])];
    newOptions[index] = { ...newOptions[index], text: newText };
    // FIX: Add explicit type to `props`
    setProp((props: MultipleChoiceQuestionProps) => { props.options = newOptions; }, 500);
  };

  const handleCorrectChange = (index: number, isChecked: boolean) => {
    let newOptions = [...(options || [])];
    if (allowMultipleAnswers) {
      newOptions[index] = { ...newOptions[index], isCorrect: isChecked };
    } else {
      newOptions = newOptions.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }));
    }
    // FIX: Add explicit type to `props`
    setProp((props: MultipleChoiceQuestionProps) => { props.options = newOptions; });
  };
  
  const handleAllowMultipleChange = (isAllowed: boolean) => {
    // FIX: Add explicit type to `props`
    setProp((props: MultipleChoiceQuestionProps) => { 
        props.allowMultipleAnswers = isAllowed;
        
        // If switching to single answer, clean up the options
        if (!isAllowed && props.options) {
            let hasFoundFirstCorrect = false;
            props.options = props.options.map((opt: QuestionOption) => {
                if (opt.isCorrect && !hasFoundFirstCorrect) {
                    hasFoundFirstCorrect = true;
                    return opt; // Keep the first correct one
                }
                return { ...opt, isCorrect: false }; // Uncheck others
            });
        }
    });
  };

  const handleAddOption = () => {
    const newOptions = [...(options || []), { text: "New Option", isCorrect: false }];
    // FIX: Add explicit type to `props`
    setProp((props: MultipleChoiceQuestionProps) => { props.options = newOptions; });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...(options || [])];
    newOptions.splice(index, 1);
    // FIX: Add explicit type to `props`
    setProp((props: MultipleChoiceQuestionProps) => { props.options = newOptions; });
  };

  const correctOptionIndex = options?.findIndex(opt => opt.isCorrect) ?? -1;

  return (
    <Accordion type="multiple" defaultValue={['content', 'options']} className="w-full">
      <AccordionItem value="content">
        <AccordionTrigger className="p-2 text-sm font-medium">Question Content</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-1.5"><Label>Title</Label><Input value={title} onChange={(e) => setProp((props: MultipleChoiceQuestionProps) => { props.title = e.target.value; }, 500)} /></div>
          <div className="grid gap-1.5"><Label>Prompt (Markdown)</Label><Textarea value={prompt} onChange={(e) => setProp((props: MultipleChoiceQuestionProps) => { props.prompt = e.target.value; }, 500)} /></div>
          <div className="grid gap-1.5"><Label>Instruction</Label><Input value={instruction} onChange={(e) => setProp((props: MultipleChoiceQuestionProps) => { props.instruction = e.target.value; }, 500)} /></div>
          <div className="grid gap-1.5"><Label>Button Text</Label><Input value={buttonText} onChange={(e) => setProp((props: MultipleChoiceQuestionProps) => { props.buttonText = e.target.value; }, 500)} /></div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="options">
        <AccordionTrigger className="p-2 text-sm font-medium">Answer Options</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label>Allow Multiple Correct Answers</Label>
            <Switch checked={allowMultipleAnswers} onCheckedChange={handleAllowMultipleChange} />
          </div>
          <div className="space-y-3">
            {!allowMultipleAnswers ? (
              <RadioGroup value={correctOptionIndex.toString()} onValueChange={(val) => handleCorrectChange(parseInt(val), true)}>
                {options?.map((option, index) => (
                  <div key={index} className="p-3 rounded-md border space-y-3 bg-background">
                    <div className="flex items-center justify-between">
                        <Label>Option {index + 1}</Label>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveOption(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <Textarea placeholder="Enter option text..." value={option.text} onChange={(e) => handleOptionTextChange(index, e.target.value)} />
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`r${index}`} />
                        <Label htmlFor={`r${index}`}>Set as Correct Answer</Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              options?.map((option, index) => (
                <div key={index} className="p-3 rounded-md border space-y-3 bg-background">
                  <div className="flex items-center justify-between">
                        <Label>Option {index + 1}</Label>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveOption(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  <Textarea placeholder="Enter option text..." value={option.text} onChange={(e) => handleOptionTextChange(index, e.target.value)} />
                  <div className="flex items-center space-x-2">
                    <Switch id={`correct-${index}`} checked={option.isCorrect} onCheckedChange={(val) => handleCorrectChange(index, val)} />
                    <Label htmlFor={`correct-${index}`}>Correct Answer</Label>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button onClick={handleAddOption} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Answer Option
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="feedback">
        <AccordionTrigger className="p-2 text-sm font-medium">Feedback Messages</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-1.5"><Label>Feedback for Correct Answer</Label><Textarea value={feedbackCorrect} onChange={(e) => setProp((props: MultipleChoiceQuestionProps) => { props.feedbackCorrect = e.target.value; }, 500)} /></div>
          <div className="grid gap-1.5"><Label>Feedback for Incorrect Answer</Label><Textarea value={feedbackIncorrect} onChange={(e) => setProp((props: MultipleChoiceQuestionProps) => { props.feedbackIncorrect = e.target.value; }, 500)} /></div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
