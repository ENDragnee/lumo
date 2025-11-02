"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { TableComponent } from "@/components/editor-components/TableComponent";
import { TableRowComponent } from "@/components/editor-components/TableRowComponent";
import { TableCellComponent } from "@/components/editor-components/TableCellComponent";
import { Table } from "lucide-react";

export function TableToolPanel() {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Table</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        <p className="text-sm text-muted-foreground mb-4">Drag a table onto the canvas.</p>
        <div
          ref={(ref: HTMLDivElement | null) => {
            if(ref){
              connectors.create(ref, 
                <TableComponent>
                  <TableRowComponent>
                    <TableCellComponent isHeader>Header 1</TableCellComponent>
                    <TableCellComponent isHeader>Header 2</TableCellComponent>
                  </TableRowComponent>
                  <TableRowComponent>
                    <TableCellComponent>Data 1</TableCellComponent>
                    <TableCellComponent>Data 2</TableCellComponent>
                  </TableRowComponent>
                </TableComponent>
              )
            }
          }}
          className="cursor-grab p-4 border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-4"
        >
          <Table className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold">2x2 Table</h3>
          </div>
        </div>
      </div>
    </div>
  );
}