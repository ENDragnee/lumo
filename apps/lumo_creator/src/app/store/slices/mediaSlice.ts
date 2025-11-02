import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IMediaData } from '@/models/Media';

// Interface for the thunk arguments
export interface FetchMediaParams {
  tag?: string;
  limit?: number;
}

interface MediaState {
  items: IMediaData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MediaState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchMedia = createAsyncThunk<
  IMediaData[],
  // THE FIX (Part 1): We specify that the thunk can be called with `FetchMediaParams` or `undefined`.
  // Using `undefined` is more standard for optional arguments than `void`.
  FetchMediaParams | undefined,
  { rejectValue: string }
>(
  'media/fetchMedia',
  async (params = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();

      if (params.tag) {
        searchParams.append('tag', params.tag);
      }
      if (params.limit) {
        searchParams.append('limit', String(params.limit));
      }

      const queryString = searchParams.toString();
      const apiUrl = `/api/media${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server responded with an error!');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch media.');
      }

      return data.data as IMediaData[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addMediaItem: (state, action: PayloadAction<IMediaData>) => {
      state.items.unshift(action.payload);
      if (state.items.length > 20) {
        state.items.pop();
      }
    },
    removeMediaItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedia.fulfilled, (state, action: PayloadAction<IMediaData[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { addMediaItem, removeMediaItem } = mediaSlice.actions;
export default mediaSlice.reducer;
