import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ManagerViewType = 'visual' | 'list';

interface ManagerViewState {
  viewType: ManagerViewType;
}

const initialState: ManagerViewState = {
  viewType: 'visual', // Default to the visual editor
};

export const managerViewSlice = createSlice({
  name: 'managerView',
  initialState,
  reducers: {
    setManagerView: (state, action: PayloadAction<ManagerViewType>) => {
      state.viewType = action.payload;
    },
  },
});

export const { setManagerView } = managerViewSlice.actions;
export default managerViewSlice.reducer;
