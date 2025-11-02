import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ViewMode = 'grid' | 'list';

interface ViewState {
  viewMode: ViewMode;
}

const initialState: ViewState = {
  viewMode: 'grid', // Default to grid view
};

export const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setViewMode } = viewSlice.actions;

export default viewSlice.reducer;
