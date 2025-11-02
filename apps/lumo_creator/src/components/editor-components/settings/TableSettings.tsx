"use client";

import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { TableProps } from '../TableComponent';
import { TableRowComponent } from '../TableRowComponent';
import { TableCellComponent } from '../TableCellComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TableSettings = () => {
  const { id: selfId, actions: { setProp } } = useNode();
  const { actions: { add }, query } = useEditor();

  const { width, borderStyle, borderColor, borderWidth } = useNode<TableProps>(node => ({
    width: node.data.props.width,
    borderStyle: node.data.props.borderStyle,
    borderColor: node.data.props.borderColor,
    borderWidth: node.data.props.borderWidth,
  }));

  const handleAddRow = () => {
    const newRow = query.createNode(<TableRowComponent><TableCellComponent /></TableRowComponent>);
    add(newRow, selfId);
  };

  return (
    <Accordion type="multiple" defaultValue={['manage', 'style']} className="w-full p-1">
      <AccordionItem value="manage">
        <AccordionTrigger className="p-2">Manage Rows</AccordionTrigger>
        <AccordionContent className="p-2">
          <Button onClick={handleAddRow} className="w-full">Add Row</Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="style">
        <AccordionTrigger className="p-2">Table Style</AccordionTrigger>
        <AccordionContent className="p-2 space-y-4">
          <div className="grid gap-2">
            <Label>Width</Label>
            <Input value={width} onChange={e => setProp((props: TableProps) => props.width = e.target.value, 500)} />
          </div>
          <div className="grid gap-2">
            <Label>Border Style</Label>
            {/* FIX: Cast the incoming value to the expected type */}
            <Select value={borderStyle} onValueChange={(val) => setProp((props: TableProps) => props.borderStyle = val as TableProps['borderStyle'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid gap-2">
            <Label>Border Color</Label>
            <Input type="color" value={borderColor} onChange={e => setProp((props: TableProps) => props.borderColor = e.target.value)} />
          </div>
           <div className="grid gap-2">
            <Label>Border Width (px)</Label>
            <Input type="number" min="0" value={borderWidth} onChange={e => setProp((props: TableProps) => props.borderWidth = parseInt(e.target.value))} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};