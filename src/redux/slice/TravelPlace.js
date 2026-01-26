import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/Data/Location`


export const fetchTravelPlace = createAsyncThunk(
  'TravelPlace/fetch',
  async ({ userId, limit = 10 }) => {
    const res = await axios.post(API, {
      _id: userId,
      limit,
    })
    return res.data
  }
)


export const fetchMoreTravelPlace = createAsyncThunk(
  'TravelPlace/fetchMore',
  async ({ userId, lastId, limit = 10 }) => {
    const res = await axios.post(API, {
      _id: userId,
      lastId,
      limit,
    })
    return res.data
  }
)

const TravelPlaceSlice = createSlice({
  name: 'TravelPlace',
  initialState: {
    items: [],
    loading: false,
    loadingMore: false,
    error: null,

    lastId: null,
    hasMore: true,
  },
  reducers: {
    resetPlaces: (state) => {
      state.items = []
      state.lastId = null
      state.hasMore = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelPlace.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTravelPlace.fulfilled, (state, action) => {
        state.loading = false

        state.items = action.payload.Locdata
        state.lastId = action.payload.pagination.lastId
        state.hasMore = action.payload.pagination.hasMore
      })
      .addCase(fetchTravelPlace.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      
      .addCase(fetchMoreTravelPlace.pending, (state) => {
        state.loadingMore = true
      })
      .addCase(fetchMoreTravelPlace.fulfilled, (state, action) => {
        state.loadingMore = false

        if (!action.payload.Locdata.length) {
          state.hasMore = false
          return
        }

        state.items.push(...action.payload.Locdata)
        state.lastId = action.payload.pagination.lastId
        state.hasMore = action.payload.pagination.hasMore
      })
      .addCase(fetchMoreTravelPlace.rejected, (state, action) => {
        state.loadingMore = false
        state.error = action.error.message
      })
  },
})

export const { resetPlaces } = TravelPlaceSlice.actions
export default TravelPlaceSlice.reducer

