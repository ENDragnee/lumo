import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The type for the tool itself can remain the same
export type ManagerTool = 'connect' | 'delete';

// Rename the state interface for clarity
interface ManagerToolState {
  tool: ManagerTool;
}

const initialState: ManagerToolState = {
  tool: 'connect', // Default tool remains 'connect'
};

// Rename the slice itself
export const managerToolSlice = createSlice({
  name: 'managerTool', // <-- Change the name property
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<ManagerTool>) => {
      state.tool = action.payload;
    },
  },
});

export const { setTool } = managerToolSlice.actions;
export default managerToolSlice.reducer;
