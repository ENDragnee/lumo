"use client";

import React from 'react';
import { useNode } from '@craftjs/core';
import { ShortAnswerQuestionProps } from '../ShortAnswerQuestionComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';

export const ShortAnswerQuestionSettings = () => {
  const {
    actions: { setProp },
    questionText,
    acceptedAnswers,
    caseSensitive,
    explanation,
    inputPlaceholder,
    buttonText
  } = useNode<ShortAnswerQuestionProps>(node => node.data.props);

  const handleAnswerChange = (index: number, newText: string) => {
    const newAnswers = [...(acceptedAnswers || [])];
    newAnswers[index] = newText;
    setProp((props: ShortAnswerQuestionProps) => { props.acceptedAnswers = newAnswers; }, 500);
  };

  const handleAddAnswer = () => {
    const newAnswers = [...(acceptedAnswers || []), ""];
    setProp((props: ShortAnswerQuestionProps) => { props.acceptedAnswers = newAnswers; });
  };

  const handleRemoveAnswer = (index: number) => {
    const newAnswers = [...(acceptedAnswers || [])];
    newAnswers.splice(index, 1);
    setProp((props: ShortAnswerQuestionProps) => { props.acceptedAnswers = newAnswers; });
  };


  return (
    <Accordion type="multiple" defaultValue={['content', 'answer']} className="w-full">
      <AccordionItem value="content">
        <AccordionTrigger className="p-2 text-sm font-medium">Question Content</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-1.5">
            <Label>Question (Markdown)</Label>
            <Textarea 
              value={questionText} 
              onChange={(e) => setProp((props: ShortAnswerQuestionProps) => { props.questionText = e.target.value; }, 500)}
              placeholder="Enter the question here..."
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Input Placeholder</Label>
            <Input 
              value={inputPlaceholder} 
              onChange={(e) => setProp((props: ShortAnswerQuestionProps) => { props.inputPlaceholder = e.target.value; }, 500)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Button Text</Label>
            <Input 
              value={buttonText} 
              onChange={(e) => setProp((props: ShortAnswerQuestionProps) => { props.buttonText = e.target.value; }, 500)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="answer">
        <AccordionTrigger className="p-2 text-sm font-medium">Accepted Answers</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>Case Sensitive</Label>
              <Switch 
                checked={caseSensitive} 
                onCheckedChange={(val) => setProp((props: ShortAnswerQuestionProps) => { props.caseSensitive = val; })}
              />
            </div>

            <Label className="font-semibold">Define one or more correct answers.</Label>
            <div className="space-y-2">
                {acceptedAnswers?.map((answer, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input 
                          value={answer}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          placeholder={`Answer #${index + 1}`}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleRemoveAnswer(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button onClick={handleAddAnswer} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Accepted Answer
            </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="feedback">
        <AccordionTrigger className="p-2 text-sm font-medium">Feedback</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-1.5">
            <Label>Explanation</Label>
            <Textarea 
              value={explanation} 
              onChange={(e) => setProp((props: ShortAnswerQuestionProps) => { props.explanation = e.target.value; }, 500)}
              placeholder="Explain the correct answer. This appears after the user submits."
            />
             <p className="text-xs text-muted-foreground">This message is shown to the user after they answer.</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
