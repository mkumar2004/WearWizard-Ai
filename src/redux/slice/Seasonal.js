import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSeasonalData = createAsyncThunk(
  'season/fetchSeasonalData',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/Gen/SeasonalData`, {
        params: { _id: userId },
      });
      return res.data.Locdata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch seasonal data'
      );
    }
  }
);

const seasonSlice = createSlice({
  name: 'season',
  initialState: {
    seasons: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeasonalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeasonalData.fulfilled, (state, action) => {
        state.loading = false;
        state.seasons = action.payload;
      })
      .addCase(fetchSeasonalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default seasonSlice.reducer;
