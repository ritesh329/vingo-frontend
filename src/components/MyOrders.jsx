import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdArrowBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom'
import UserOrderCard from './UserOrderCard'
import OwnerOrderCard from './OwnerOrderCard'
import { useEffect } from 'react'
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice'

function MyOrders() {
  const { userData, myOrders,socket } = useSelector(state => state.user)
  const navigate = useNavigate()
 const dispatch=useDispatch();

    useEffect(() => {
    if (!socket || !userData?._id) return;

    console.log("🟢 Listening for new orders...");

    const handleNewOrder = (data) => {
      const orderOwnerId = data?.shopOrders?.owner?._id;

      if (orderOwnerId === userData._id) {
        console.log("🆕 New order received for this user:", data);
        const updatedOrders = [data, ...(myOrders || [])];
        dispatch(setMyOrders(updatedOrders));
      }
    };

    // ✅ Add listener
    socket.on("newOrder", handleNewOrder);

     socket.on('update-status',({orderId,shopId,status,userId})=>{

        if(userId==userData._id)
        {
            dispatch(updateRealtimeOrderStatus({orderId,shopId,status}))
        }
          

     })
    // ✅ Clean up on unmount or socket change
    return () => {
      socket?.off("newOrder", handleNewOrder);
      socket?.off('update-status')
      console.log("🔴 Stopped listening for new orders");
    };
  }, [socket, userData?._id, dispatch]);





  








  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
      <div className="w-full max-w-[800px] p-4">

        {/* Back Button */}
        <div className="flex items-center gap-5 mb-4">
          <div 
            className="cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <IoMdArrowBack size={28} className="text-[#ff4d2d]" />
          </div>
          <h1 className="text-xl font-semibold">My Orders</h1>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
        {myOrders?.map((order,index)=>( userData.role=="user" ? ( <UserOrderCard data={order} key={index} /> ): userData.role=="owner" ? ( <OwnerOrderCard data={order} key={index} /> ) :null ))}
        </div>
      </div>
    </div>
  )
}

export default MyOrders
