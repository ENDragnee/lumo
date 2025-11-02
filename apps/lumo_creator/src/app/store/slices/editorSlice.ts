// @/app/store/slices/editorSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UPDATE: Added all tool types from the toolbar to this union type.
export type ToolType =
  | 'text'
  | 'image'
  | 'video'
  | 'simulation'
  | 'container'
  | 'tab'
  | 'carousel'
  | 'challenges'
  | 'flashcard'
  | 'callout'
  | null;

interface EditorState {
  isTreeSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  activeTool: ToolType;
}

const initialState: EditorState = {
  isTreeSidebarOpen: true,
  isRightSidebarOpen: true,
  activeTool: null, // Default to no active tool
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    toggleRightSidebar: (state) => {
      state.isRightSidebarOpen = !state.isRightSidebarOpen;
    },
    toggleTreeSidebar: (state) => {
      state.isTreeSidebarOpen = !state.isTreeSidebarOpen;
    },
    setActiveTool: (state, action: PayloadAction<ToolType>) => {
      // If the same tool is clicked again, toggle it off.
      if (state.activeTool === action.payload) {
        state.activeTool = null;
      } else {
        // A new tool is selected
        state.activeTool = action.payload;
        // KEY BEHAVIOR: Always ensure the sidebar is open when a tool is activated.
        state.isRightSidebarOpen = true;
      }
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
        state.isRightSidebarOpen = action.payload;
        // If we're explicitly closing the sidebar, also deselect the active tool.
        if (!action.payload) {
            state.activeTool = null;
        }
    }
  },
});

export const { toggleTreeSidebar, toggleRightSidebar, setActiveTool, setSidebarOpen } = editorSlice.actions;

export default editorSlice.reducer;
