import React from 'react'
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css";
import { useState } from 'react';
import { useEffect } from 'react';
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { setAddress, setLocation } from '../redux/mapSlice';
import { addMyOrders } from '../redux/userSlice';
function CheckOut() {
  //  const [searchLocation,setSearchLocation]=useState("")
  const {cartItems,totalAmount}=useSelector(state=>state.user);
   const {location,address}=useSelector(state=>state.map);
    const [addressInput,setAddressInput]=useState("");
    const [paymentMethod,setPaymentMethod]=useState("cod");
     const deliveryFee=totalAmount>500?0:40
     const AmountWithDeliveryFee=totalAmount+deliveryFee
   
     const apikey = import.meta.env.VITE_GEOAPIKEY;
  const navigate=useNavigate();
     const dispatch=useDispatch();


     function RecenterMap({lacation}){

       if(location.lat && location.lon)
       {
            const map=useMap();
      map.setView([location.lat,location.lon],16,{animate:true});
  }

     return null;
    
       }
     

  const getAddressByLatLng=async (lat,lng)=>{

    try{
      
       const result = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await result.json();
      console.log("this is checkCart data",data.results[0].formatted);
      dispatch(setAddress(data.results[0].formatted))

    }catch(err)
  {
      console.log("thi error is checkCart ",err)
  }
  }

  const getCurrentLocation=()=>{
       navigator.geolocation.getCurrentPosition( async (position)=>{
           const latitude=position.coords.latitude
           const longitude=position.coords.longitude
           dispatch(setLocation({lat:latitude,lon:longitude}))
           getAddressByLatLng(latitude,longitude);
       })
  }


  const onDragEnd=(e)=>{
      console.log(e.target._latlng)
      const {lat,lng}=e.target._latlng;
      dispatch(setLocation({lat,lon:lng}));

      getAddressByLatLng(lat,lng);

      // const map=useMap();
      // map.setView([lat,lng],16,{animate:true});
  }

    const getLatLngByAddress=async ()=>{
      try{

          const result= await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apikey}
`,{
  method:"GET",
 headers: {
     'Content-type':'application/json'
  }

})

       if(!result.ok)
       {
            console.log("this is error in checkout page");
       }
      const data=await result.json();
       
       const {lat,lon}=data.features[0].properties;
      console.log("this data is belong on checkout cart ",data.features[0].properties.lat);
        dispatch(setLocation({lat,lon}));
    
      }catch(err)
      {
           console.log("this catch error in checkout cart ",err);
      }
    }

  useEffect(()=>{

      setAddressInput(address)
  },[address])
    
  // useEffect(()=>{

  //     setSearchLocation(address);
  // },[address])
const handlePlaceOrder = async () => {
  try {
    const result = await fetch("http://localhost:3000/api/order/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 👈 keep cookies/session
      body: JSON.stringify({
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          latitude: location.lat,
          longitude: location.lon,
        },
        totalAmount,
        cartItems,
      }),
    });

    const data = await result.json();
    console.log("Cart page response:", data);

    if (!result.ok) {
      alert(data?.message || "Error uploading order data");
      return;
    }

    alert("Order placed successfully ✅");
     dispatch(addMyOrders(data));
    navigate("/order-placed");
  } catch (err) {
    console.error("Error in cart section:", err);
    alert("Something went wrong while placing the order.");
  }
};

  


  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
      <div className='absolute top-[20px] left-[20px] z-[10] ' onClick={()=>navigate("/")}>

         <IoMdArrowBack size={35} className="text-[#ff4d2d]" />  

      </div>

      <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
         
          <h1 className='text-2xl font-bold text-gray-800'>checkOut</h1>
          
          <section>

   <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800 '><IoLocation  className='text-[#ff4d2d]' /> Delivery Location</h2>

    <div className='flex gap-2 mb-3'>
        <input type="text" className='flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='enter the delivery location' value={addressInput} onChange={(e)=>setAddressInput(e.target.value)}/>

        <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={getLatLngByAddress}><IoSearchSharp size={20}/></button>
         <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={()=>getCurrentLocation()}><BiCurrentLocation size={20}/></button>
    </div>


          <div className='rounded-xl border overflow-hidden'>
            <div className='h-64 w-full flex items-center justify-center'>
       
             <MapContainer className={'w-full h-full'} center={[location?.lat,location?.lon]} zoom={16} >
              
                      <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <RecenterMap location={location} />
    <Marker position={[location?.lat,location?.lon]} draggable eventHandlers={{dragend:onDragEnd}}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>

               </MapContainer>

            </div>


          </div>


          </section>

         <section>


          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Payment Method</h2>
           <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>


                <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                   paymentMethod==="cod" ? "border-[#ff4d2d] bg-orange-50 shadow " : "border-gray-200 hover:border-gray-300" 
                }`} onClick={()=>setPaymentMethod("cod")}>

                    <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>

                        <MdDeliveryDining className='text-green-600 text-xl'/>
                    </span>
                    <div>
                        <p  className='font-medium text-gray-800'>Cash on Delivery</p>
                        <p className='text-xs text-gray-500'>Pay when you food arrives</p>
                    </div>

                </div>

  <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                   paymentMethod==="online" ? "border-[#ff4d2d] bg-orange-50 shadow " : "border-gray-200 hover:border-gray-300" 
                }`} onClick={()=>setPaymentMethod("online")}>

                      
                      <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 '>

                        <FaMobileAlt  className='text-purple-700 text-lg'/>
                      </span>
                      <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 '>
                         
                          <FaCreditCard className='text-blue-700 text-lg'/>
                      </span>
                       <div>
                       <p className='font-medium text-gray-800 '>UPI / Credit / Debit Card</p>
                       <p>Pay Securely Online</p>
                      </div>
                </div>



           </div>

         </section>

       
       <section>

        <h2 className='text-lg font-semibold mb-3 text-gray-500 '>Order Summary</h2>
        <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
            {cartItems.map((item,index)=>(
                <div key={index} className='flex justify-between text-sm text-gray-700'>
                       <span>{item.name} x {item.quantity}</span>
                          <span>{item.price*item.quantity}</span>
                  </div>
            ))}

            <hr className='border-gray-200 my-2'/>

            <div className='flex justify-between text-gray-700'>

            <span>Sub Total</span>
            <span>{totalAmount}</span>
            </div>

            <div className='flex justify-between text-gray-700'>

              <span>Delivery Fee</span>
              <span>{deliveryFee==0 ? "Free" : deliveryFee }</span>
            </div>
          </div>
            <div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
             
              <span>Total</span>
               <span>{AmountWithDeliveryFee}</span>
            </div>
  
           


       </section>

          <button className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded font-semibold ' onClick={handlePlaceOrder}>

              {paymentMethod == "cod" ? "Place Order": "Pay & Place Order"}
               
          </button>
      
      </div>



    </div>
  )
}

export default CheckOut