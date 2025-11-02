//@/app/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './slices/editorSlice';
import mediaReducer from './slices/mediaSlice';
import viewReducer from './slices/viewSlice';
import toolbarReducer from './slices/toolbarSlice'; 
import managerToolReducer from './slices/managerToolSlice';
import managerViewReducer from './slices/managerViewSlice'; 

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    media: mediaReducer,
    view: viewReducer, // Add the view reducer here
    toolbar: toolbarReducer,
    managerTool: managerToolReducer,
    managerView: managerViewReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
