import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/Gen/top-picks`

export const fetchTopPicks = createAsyncThunk(
  'topPicks/fetch',
  async (city, { rejectWithValue }) => {
    try {
      const res = await axios.get(API, { params: { city } })
      return { city, picks: res.data.picks }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch top picks')
    }
  }
)

const topPicksSlice = createSlice({
  name: 'topPicks',
  initialState: {
    picks: [],
    city: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTopPicks: (state) => {
      state.picks = []
      state.city = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopPicks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopPicks.fulfilled, (state, action) => {
        state.loading = false
        state.picks = action.payload.picks
        state.city = action.payload.city
      })
      .addCase(fetchTopPicks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearTopPicks } = topPicksSlice.actions
export default topPicksSlice.reducer
