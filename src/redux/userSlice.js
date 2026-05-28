import { createSlice } from "@reduxjs/toolkit";

/**
 * User slice manages user information, location, and shops in current city.
 */
const initialState = {
  /** Logged-in user information */
  userData: null,

  /** Selected city */
  city: null,

  /** Selected state (renamed as stateName to avoid reserved word conflict) */
  stateName: null,

  /** Current user address */
  currentAddress: null,

  /** Shops available in user's city */
  shopsInMyCity: null,
  itemsInMyCity:null,
  cartItems:[],
  totalAmount:0,
  myOrders:[],
  searchItems:null,
  socket:null

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /** Set or update user data */
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
     setItemsInMyCity: (state, action) => {
      state. itemsInMyCity = action.payload;
    },

    /** Set city */
    setCity: (state, action) => {
      state.city = action.payload;
    },

    /** Set state name */
    setStateName: (state, action) => {
      state.stateName = action.payload;
    },

    /** Set current address */
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },

    /** Set shops in current city */
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    addToCart:(state,action)=>{

      const cartItem=action.payload
      const existingItem=state.cartItems.find(i=>i.id==cartItem.id);
      if(existingItem)
      {
           existingItem.quantity=cartItem.quantity
      }else{

          state.cartItems.push(cartItem)
      }
      
       state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0);
      

    },
    updateQuantity:(state,action)=>{
      const {id,quantity}=action.payload
      const item=state.cartItems.find(i=>i.id==id)
      if(item)
      {
          item.quantity=quantity
      }
       state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0);
    },

    removeCartItem:(state,action)=>{
        state.cartItems=state.cartItems.filter(i=>i.id!==action.payload)
         state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0);
    },

    setMyOrders:(state,action)=>{
        state.myOrders=action.payload
    },
    addMyOrders:(state,action)=>{
 
       state.myOrders=[action.payload,...state.myOrders]


    },
    updateOrderStatus:(state,action)=>{
 
           const {orderId,shopId,status}=action.payload
           const order=state.myOrders.find((o)=>o._id==orderId)

           if(order)
           {
              if(order.shopOrders && order.shopOrders.shop._id==shopId){
                  order.shopOrders.status=status
              }
           }


    },

     updateRealtimeOrderStatus:(state,action)=>{
 
           const {orderId,shopId,status}=action.payload
           const order=state.myOrders.find((o)=>o._id==orderId)

           if(order)
           {
              // if(order.shopOrders && order.shopOrders.shop._id==shopId){
              //     order.shopOrders.status=status
              // }


              const shopOrder=order.shopOrders.find(so=>so.shop._id==shopId)
              if(shopOrder)
              {

                   shopOrder.status=status
              }
           }


    },
    setSearchItems:(state,action)=>{

           state.searchItems=action.payload
    },
     setSocket:(state,action)=>{

           state.socket=action.payload
    },


    /** Clear all user-related data */
    clearUserData: () => initialState,

    /**
     * Update any user field dynamically
     * Example: dispatch(updateUserField({ key: "city", value: "Mumbai" }))
     */
    updateUserField: (state, action) => {
      const { key, value } = action.payload;
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        state[key] = value;
      }
    },
  },
});

export const {
  setUserData,
  clearUserData,
  setCity,
  setCurrentAddress,
  setStateName,
  setShopsInMyCity,
  updateUserField,
   setItemsInMyCity,
   addToCart,
    updateQuantity,
     removeCartItem,
     setMyOrders,
      addMyOrders,
       updateOrderStatus,
       setSearchItems,
        setSocket,
         updateRealtimeOrderStatus

} = userSlice.actions;

export default userSlice.reducer;
