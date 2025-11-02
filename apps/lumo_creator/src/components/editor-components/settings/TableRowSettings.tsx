"use client";

import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { TableCellComponent } from '../TableCellComponent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';

export const TableRowSettings = () => {
  // FIX: Correctly select properties from the node's data object
  const { id: selfId, childNodes } = useNode((node) => ({
    childNodes: node.data.nodes,
  }));
  const { actions: { add, delete: deleteNode }, query } = useEditor();

  const handleAddCell = () => {
    const newCell = query.createNode(<TableCellComponent />);
    add(newCell, selfId);
  };

  const handleRemoveCell = () => {
    if (childNodes && childNodes.length > 0) {
      deleteNode(childNodes[childNodes.length - 1]);
    }
  };

  return (
    <Accordion type="multiple" defaultValue={['cells']} className="w-full p-1">
      <AccordionItem value="cells">
        <AccordionTrigger className="p-2">Manage Cells</AccordionTrigger>
        <AccordionContent className="p-2 space-y-2">
          <Button onClick={handleAddCell} className="w-full">Add Cell</Button>
          <Button onClick={handleRemoveCell} variant="outline" className="w-full" disabled={!childNodes || childNodes.length === 0}>Remove Last Cell</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};