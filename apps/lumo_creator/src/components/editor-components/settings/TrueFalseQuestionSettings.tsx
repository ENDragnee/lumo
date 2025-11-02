"use client";

import React from 'react';
import { useNode } from '@craftjs/core';
import { TrueFalseQuestionProps } from '../TrueFalseQuestionComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const TrueFalseQuestionSettings = () => {
  const {
    actions: { setProp },
    questionText,
    correctAnswer,
    explanation,
    buttonText
  } = useNode<TrueFalseQuestionProps>(node => node.data.props);

  return (
    <Accordion type="multiple" defaultValue={['content', 'answer']} className="w-full">
      <AccordionItem value="content">
        <AccordionTrigger className="p-2 text-sm font-medium">Question Content</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-1.5">
            <Label>Question (Markdown)</Label>
            <Textarea 
              value={questionText} 
              onChange={(e) => setProp((props: TrueFalseQuestionProps) => { props.questionText = e.target.value; }, 500)}
              placeholder="Enter the true/false statement here..."
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Button Text</Label>
            <Input 
              value={buttonText} 
              onChange={(e) => setProp((props: TrueFalseQuestionProps) => { props.buttonText = e.target.value; }, 500)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="answer">
        <AccordionTrigger className="p-2 text-sm font-medium">Correct Answer</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
            <div className="p-3 border rounded-lg">
                <Label className="font-semibold">Set the Correct Answer</Label>
                <RadioGroup 
                    value={String(correctAnswer)}
                    onValueChange={(value) => {
                        setProp((props: TrueFalseQuestionProps) => { props.correctAnswer = (value === 'true'); });
                    }}
                    className="mt-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="is-true" />
                        <Label htmlFor="is-true">True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="is-false" />
                        <Label htmlFor="is-false">False</Label>
                    </div>
                </RadioGroup>
            </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="feedback">
        <AccordionTrigger className="p-2 text-sm font-medium">Feedback</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-1.5">
            <Label>Explanation</Label>
            <Textarea 
              value={explanation} 
              onChange={(e) => setProp((props: TrueFalseQuestionProps) => { props.explanation = e.target.value; }, 500)}
              placeholder="Explain why the answer is true or false. This appears after the user submits their answer."
            />
             <p className="text-xs text-muted-foreground">This message is shown to the user after they answer, regardless of whether they were correct or incorrect.</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
