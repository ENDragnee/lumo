"use client";

import React from 'react';
import { useNode } from '@craftjs/core';
import { FlashcardProps } from '../FlashcardComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const FlashcardSettings = () => {
  const {
    actions: { setProp },
    titleText,
    questionText,
    answerText,
    buttonText,
    buttonVariant,
    cardBackgroundColor,
    borderRadius,
  } = useNode<FlashcardProps>((node) => node.data.props);

  return (
    <Accordion type="multiple" defaultValue={['content', 'style']} className="w-full p-1">
      <AccordionItem value="content">
        <AccordionTrigger className="p-2">Content</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              value={titleText}
              onChange={(e) => setProp((props: FlashcardProps) => (props.titleText = e.target.value), 500)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Question (Markdown enabled)</Label>
            <Textarea
              value={questionText}
              rows={5}
              onChange={(e) => setProp((props: FlashcardProps) => (props.questionText = e.target.value), 500)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Answer (Markdown enabled)</Label>
            <Textarea
              value={answerText}
              rows={5}
              onChange={(e) => setProp((props: FlashcardProps) => (props.answerText = e.target.value), 500)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="style">
        <AccordionTrigger className="p-2">Style</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-2">
            <Label>Button Text</Label>
            <Input value={buttonText} onChange={(e) => setProp((props: FlashcardProps) => (props.buttonText = e.target.value), 500)} />
          </div>
          <div className="grid gap-2">
            <Label>Button Variant</Label>
            <Select value={buttonVariant} onValueChange={(val) => setProp((props: FlashcardProps) => props.buttonVariant = val as FlashcardProps['buttonVariant'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Card Background</Label>
            <Input type="color" value={cardBackgroundColor} onChange={(e) => setProp((props: FlashcardProps) => (props.cardBackgroundColor = e.target.value))} />
          </div>
          <div>
            <Label>Border Radius: {borderRadius}px</Label>
            <Slider value={[borderRadius || 0]} onValueChange={([val]) => setProp((props: FlashcardProps) => (props.borderRadius = val))} max={32} step={1} className="mt-2" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};