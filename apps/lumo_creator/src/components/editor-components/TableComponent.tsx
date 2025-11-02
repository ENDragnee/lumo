"use client";

import React from 'react';
import { useNode, UserComponent } from '@craftjs/core';
import { TableSettings } from './settings/TableSettings';

export interface TableProps {
  width?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderColor?: string;
  borderWidth?: number;
  children?: React.ReactNode;
}

type CraftableTableComponent = UserComponent<TableProps>;

export const TableComponent: CraftableTableComponent = ({
  width = '100%',
  borderStyle = 'solid',
  borderColor = '#cccccc',
  borderWidth = 1,
  children
}) => {
  const { connectors: { connect, drag } } = useNode();
  
  const tableStyle: React.CSSProperties = {
    width,
    borderStyle,
    borderColor: borderStyle === 'none' ? 'transparent' : borderColor,
    borderWidth: `${borderWidth}px`,
    borderCollapse: 'collapse',
  };

  return (
    <table
      ref={(ref: HTMLTableElement | null) => { if (ref) connect(drag(ref)); }}
      style={tableStyle}
    >
      <tbody>
        {children}
      </tbody>
    </table>
  );
};

TableComponent.craft = {
  displayName: "Table",
  isCanvas: true,
  props: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#cccccc',
    borderWidth: 1,
  },
  related: {
    settings: TableSettings,
  },
  rules: {
    canMoveIn: (incoming, self, query) => {
      // FIX: Corrected query.node(node.id).get()
      return incoming.every(node => query(node.id).get().data.displayName === 'Table Row');
    }
  }
};