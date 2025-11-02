"use client";

import React from 'react';
import { useNode, UserComponent } from '@craftjs/core';
import { TableRowSettings } from './settings/TableRowSettings';

export interface TableRowProps {
  children?: React.ReactNode;
}

// FIX: Use UserComponent for correct typing
type CraftableTableRowComponent = UserComponent<TableRowProps>;

export const TableRowComponent: CraftableTableRowComponent = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <tr ref={(ref: HTMLTableRowElement | null) => { if (ref) connect(drag(ref)); }}>
      {children}
    </tr>
  );
};

TableRowComponent.craft = {
  displayName: "Table Row",
  isCanvas: true,
  props: {},
  related: {
    settings: TableRowSettings,
  },
  rules: {
    // FIX: Types now correctly inferred, and query call is fixed
    canMoveIn: (incoming, self, query) => {
      return incoming.every(node => query(node.id).get().data.displayName === 'Table Cell');
    }
  }
};