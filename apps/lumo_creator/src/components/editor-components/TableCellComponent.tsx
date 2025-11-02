"use client";

import React from 'react';
import { useEditor, useNode, UserComponent } from '@craftjs/core';
import { TableCellSettings } from './settings/TableCellSettings';
import { cn } from '@/lib/utils';

export interface TableCellProps {
  isHeader?: boolean;
  backgroundColor?: string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  padding?: number;
  children?: React.ReactNode;
}

type CraftableTableCellComponent = UserComponent<TableCellProps>;

export const TableCellComponent: CraftableTableCellComponent = ({
  isHeader = false,
  backgroundColor = 'transparent',
  verticalAlign = 'top',
  padding = 8,
  children
}) => {
  const { connectors: { connect, drag } } = useNode();
  const { enabled: editorEnabled } = useEditor(state => ({ enabled: state.options.enabled }));
  const hasChildren = React.Children.count(children) > 0;
  
  const Tag = isHeader ? 'th' : 'td';

  const cellStyle: React.CSSProperties = {
    backgroundColor,
    verticalAlign,
    padding: `${padding}px`,
  };

  return (
    <Tag
      ref={(ref: HTMLTableCellElement | null) => { if (ref) connect(drag(ref)); }}
      style={cellStyle}
      className={cn("border border-[inherit]")}
    >
      <div className={cn(
          "min-h-[40px] w-full",
          !hasChildren && editorEnabled && "border-2 border-dashed border-blue-300",
          "transition-all duration-150 flex flex-col"
      )}>
        {hasChildren ? children : (
          editorEnabled && (
            <div className="flex items-center justify-center w-full h-full p-2">
              <p className="text-muted-foreground text-xs text-center">Drag content here</p>
            </div>
          )
        )}
      </div>
    </Tag>
  );
};

TableCellComponent.craft = {
  displayName: "Table Cell",
  isCanvas: true,
  props: {
    isHeader: false,
    backgroundColor: 'transparent',
    verticalAlign: 'top',
    padding: 8,
  },
  related: {
    settings: TableCellSettings,
  },
  rules: {
    canMoveIn: (incoming, self, query) => {
      const forbidden = ['Table', 'Table Row', 'Table Cell'];
      // FIX: Corrected query.node(node.id).get()
      return incoming.every(node => !forbidden.includes(query(node.id).get().data.displayName));
    }
  }
};