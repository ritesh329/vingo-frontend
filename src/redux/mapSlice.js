import { createSlice } from "@reduxjs/toolkit";

/**
 * User slice manages user information, location, and shops in current city.
 */
const initialState = {
  /** Logged-in user information */
  location:{

       lat:null,
       lon:null
  },
  address:null
  
};

const mapSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
   setLocation:(state,action)=>{
      const {lat,lon}=action.payload
      state.location.lat=lat
      state.location.lon=lon
   },
   setAddress:(state,action)=>{
        state.address=action.payload
   }


}});

export const {
    setLocation,setAddress
} = mapSlice.actions;

export default mapSlice.reducer;
