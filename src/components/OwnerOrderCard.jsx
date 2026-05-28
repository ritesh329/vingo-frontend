import React from 'react'
import { MdLocalPhone } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';
import { useState } from 'react';
function OwnerOrderCard({data}) {

  const token = localStorage.getItem("token");
 
  const [availableBoys,setAvailableBoys]=useState([])
   
  const dispatch=useDispatch();
const handleUpdateStatus = async (orderId, shopId, status) => {
  try {
    const result = await fetch(
      `https://vingo-sozm.onrender.com/api/order/update-status/${orderId}/${shopId}`,
      {
        method: "POST",
        headers: {
          
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ status }) // ✅ send status in the body
      }
    );

    // Parse JSON from response
    const data = await result.json();

    if (!result.ok) {
      // setError(data.message || "Order status change error");
      throw new Error(data.message || `HTTP error! status: ${result.status}`);
    }

    alert("Yes, status change successful");

    // Update Redux state
    dispatch(updateOrderStatus({ orderId, shopId, status }));

    // Set available delivery boys
    console.log("hhhhhhhhhhhhhhhhhhno   NOOOOOO",data);
    setAvailableBoys(data.availableBoys|| []);
    console.log("this is delivery available Boys", data.availableBoys);
    console.log("this is owner order card data", data);

  } catch (err) {
    console.log("this is error of owner", err);
  }
};
// Somewhere outside this function, you're logging the data:
console.log(data); // This assumes 'data' is in scope. Make sure it is.

  return (
   <div className='bg-white rounded-lg shadow p-4 space-y-4'>

         <div>
         <h2 className='text-lg font-semibold text-gray-800 '>{data.user.fullName}</h2>
         <p className='text-sm text-gray-500 '>{data.user.email}</p>
         <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'><MdLocalPhone /> <span>{data.user.mobileNo}</span> </p>
           </div>
          <div className='flex items-start flex-col gap-2 text-gray-600 text-sm'>

             <p>{data?.deliveryAddress?.text}</p>
             <p className='text-xs text-gray-500'>Lat: {data?.deliveryAddress?.latitude} , Lon: {data?.deliveryAddress?.longitude} </p>
              
          </div>
          <div className='flex space-x-4 overflow-x-auto pb-2'>
            
              {data.shopOrders.shopOrderItem.map((item,index)=>(

                  <div key={index} className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white'>
                       <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded '/>
                       <p className='text-sm font-semibold mt-1 '>{item.name}</p>
                        <p className='text-xs text-gray-500 '>Qty: {item.quantity} x { item.item.price}</p>
                      
                    </div>
              
              )  )}
          </div>

          <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>

             <span className='text-sm'>status: <span className='font-semibold capitalize text-[#ff4d2d]'>{data.shopOrders.status}</span> </span>

             <select name={data.shopOrders.status}  value={data.shopOrders.status}  className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]' onChange={(e)=>handleUpdateStatus(data._id,data.shopOrders.shop._id,e.target.value)}>
            
             {/* <option value="">Change</option> */}
               <option value="pending">Pending</option>
               <option value="preparing">Preparing</option>
               <option value="out of delivery">Out of delivery</option>
             </select>
          </div>

          {data.shopOrders.status=="out of delivery"  && <div className='mt-3 p-2 border rounded-lg text-sm bg-orange-50'> 
            
            {data.shopOrders.assignedDeliveryBoy? <p>Assigned Delivery Boys :</p> : <p>Available Delivery Boys :</p> } 
                {availableBoys.length>0 ? (
                    

                 
                  availableBoys.map((b,index)=>(
                     <div>{b.fullName}-{b.mobile}-</div>
                  ))



                ): data.shopOrders.assignedDeliveryBoy ? <div>{data.shopOrders.assignedDeliveryBoy.fullName}</div> : <div>Waiting for delivery boy to accept</div>}
            
            </div>}

          <div className='text-right font-bold text-gray-800 text-sm'>

               Total: {data.shopOrders.subtotal}
               

          </div>

    </div>

   
  )
}

export default OwnerOrderCard