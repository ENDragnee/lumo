import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for the toolbar's state
interface ToolbarState {
  isLockedOpen: boolean;
}

// Define the initial state
const initialState: ToolbarState = {
  isLockedOpen: false,
};

export const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    // Action to set the "locked open" state, e.g., when a popover is active
    setLockedOpen: (state, action: PayloadAction<boolean>) => {
      state.isLockedOpen = action.payload;
    },
  },
});

// Export the action creator for use in components
export const { setLockedOpen } = toolbarSlice.actions;

// Export the reducer to be added to the store
export default toolbarSlice.reducer;