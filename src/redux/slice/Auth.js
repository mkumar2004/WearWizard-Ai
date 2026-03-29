import { createAsyncThunk, createSlice, isRejected } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

/* LOAD AUTH FROM STORAGE */
export const AuthloadState = createAsyncThunk(
  'auth/loadAuthData',
  async () => {
    const userInfo = await AsyncStorage.getItem('userInfo')
    const token = await AsyncStorage.getItem('token')

    return {
      user: userInfo ? JSON.parse(userInfo) : null,
      token: token || null,
    }
  }
)

/* LOGIN */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userdata, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/login`,
        userdata
      )

      await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.user))
      await AsyncStorage.setItem('token', res.data.token)

      return {
        user: res.data.user,
        token: res.data.token,
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

// Register
export const RegisterUser = createAsyncThunk(
  'auth/Registeruser',
  async(userdata,{rejectWithValue})=>{
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/register`,
        userdata
      )
      await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.user))
      return {
        user: res.data.user
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

// Fetch User Profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/profile/${userId}`
      )
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch' )
    }
  }
)

/* LOGOUT */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await AsyncStorage.removeItem('userInfo')
    await AsyncStorage.removeItem('token')
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //loadstate
      .addCase(AuthloadState.pending, (state) => {
        state.loading = true
      })
      .addCase(AuthloadState.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.loading = false
      })
      .addCase(AuthloadState.rejected, (state) => {
        state.loading = false
      })
      //login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      //register
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      //logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.error = null
      })
      // fetch profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload.profile
        // Sync user data if it's more complete
        state.user = { ...state.user, ...action.payload.user }
      })
  },
})

export default authSlice.reducer

