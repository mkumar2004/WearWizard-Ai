// redux/locationSlice.js
import { createSlice } from '@reduxjs/toolkit'

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    address: null,
    coords: null,
  },
  reducers: {
    setLocation(state, action) {
      state.address = action.payload.address
      state.coords = action.payload.coords
    },
    clearLocation(state) {
      state.address = null
      state.coords = null
    },
  },
})

export const { setLocation, clearLocation } = locationSlice.actions
export default locationSlice.reducer

// import AsyncStorage from '@react-native-async-storage/async-storage'

// await AsyncStorage.setItem(
//   'USER_LOCATION',
//   JSON.stringify(address)
// )
