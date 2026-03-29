import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api/travel/travel-plan'  

export const generateTripPlan = createAsyncThunk(
  'travel/generateTripPlan',
  async (tripData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/travel/travel-plan`, {
        userId:       tripData.userId,
        fromLocation: tripData.fromLocation,
        toLocation:   tripData.toLocation,
        distance:     tripData.distance,
        budgetType:   tripData.budgetType,
        budgetDesc:   tripData.budgetDesc,
        startDate:    tripData.startDate,
        endDate:      tripData.endDate,
        tripDuration: tripData.tripDuration,
        travelType:   tripData.travelType,
        travelDesc:   tripData.travelDesc,
      })
      return res.data.plan 
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message)
    }
  }
)

export const fetchMyPlans = createAsyncThunk(
  'travel/fetchMyPlans',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/travel/my-plans/${userId}`)
      return res.data.plans
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message)
    }
  }
)

// ── Async Thunk — sync destination to Qdrant ─────────────────────────────────
export const syncDestination = createAsyncThunk(
  'travel/syncDestination',
  async (destination, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/sync/${destination}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message)
    }
  }
)


const travelSlice = createSlice({
  name: 'travel',
  initialState: {
    plan:       null,    // the generated trip plan
    loading:    false,   // true while API call is running
    error:      null,    // error message if failed
    syncing:    false,   // true while syncing destination
    syncStatus: null,    // 'success' | 'error'
    myPlans:    [],      // list of saved plans
  },
  reducers: {
    // Clear plan when user starts a new trip
    clearPlan: (state) => {
      state.plan    = null
      state.error   = null
      state.loading = false
    },
    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // ── generateTripPlan ──────────────────────────────────────────────────────
    builder
      .addCase(generateTripPlan.pending, (state) => {
        state.loading = true
        state.error   = null
        state.plan    = null
      })
      .addCase(generateTripPlan.fulfilled, (state, action) => {
        state.loading = false
        state.plan    = action.payload
      })
      .addCase(generateTripPlan.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // ── fetchMyPlans ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchMyPlans.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyPlans.fulfilled, (state, action) => {
        state.loading = false
        state.myPlans = action.payload
      })
      .addCase(fetchMyPlans.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // ── syncDestination ───────────────────────────────────────────────────────
    builder
      .addCase(syncDestination.pending, (state) => {
        state.syncing    = true
        state.syncStatus = null
      })
      .addCase(syncDestination.fulfilled, (state) => {
        state.syncing    = false
        state.syncStatus = 'success'
      })
      .addCase(syncDestination.rejected, (state) => {
        state.syncing    = false
        state.syncStatus = 'error'
      })
  },
})

export const { clearPlan, clearError } = travelSlice.actions
export default travelSlice.reducer
