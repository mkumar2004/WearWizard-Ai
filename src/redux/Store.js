import {configureStore} from '@reduxjs/toolkit'
import AuthReducer from '../redux/slice/Auth'
import Current from '../redux/slice/CurrentLocation'
import SeasonReducer from '../redux/slice/Seasonal'
import TravllReducer from '../redux/slice/TravelPlace'
import InteractionReducer from '../redux/slice/Interaction'
import TravelReducer from '../redux/slice/Travel'
const store = configureStore({
    reducer:{
       auth:AuthReducer,
       location:Current,
       season:SeasonReducer,
       TravelPlace:TravllReducer,
       interaction:InteractionReducer,
       travel:TravelReducer
    },
     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export default store;