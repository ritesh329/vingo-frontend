import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Nav from "./Nav";

import { DeliveryBoyTracking } from "./DeliveryBoyTracking";
function DeliveryBoy() {
  const { userData ,socket} = useSelector((state) => state.user);

  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox,setShowOtpBox]=useState(false)
  const [otp,setOtp]=useState("");


   useEffect(()=>{

         if(!socket || userData.role!=="deliveryBoy") return
           let watchId;
         if(navigator.geolocation)
         {

           watchId=navigator.geolocation.watchPosition((position)=>{

                const latitude=position.coords.latitude
                const Longitude=position.coords.Longitude
                
                socket.emit("updateLocation",{
                  latitude,
                  Longitude,
                  userId:userData._id
                })


             }),
             (error)=>{
                   
              console.log(error)

             },
             {
                enableHighAccuracy:true
             }

         }

         return ()=>{

              if(watchId)
                navigator.geolocation.clearWatch(watchId)

         }
          
   },[socket,userData])







  // ✅ Fetch available assignments
  const getAssignment = async () => {
    try {
      const result = await fetch("https://vingo-sozm.onrender.com/api/order/get-assignments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await result.json();

      if (!result.ok) {
        console.error("❌ Error fetching assignments:", data.message);
        return;
      }
      
      setAvailableAssignments(data);
      console.log("✅ Assignments fetched:", data);
    } catch (err) {
      console.error("❌ Server error:", err);
    }
  };

  // ✅ Accept an order
  const acceptOrder = async (assignmentId) => {
    console.log("📦 Accepting assignment ID:", assignmentId);

    try {
      const result = await fetch(`https://vingo-sozm.onrender.com/api/order/accept-order/${assignmentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await result.json();

      if (!result.ok) {
        console.error("❌ Error from server:", data.message);
        alert(data.message);
        return;
      }

      alert(data.message);
      console.log("✅ Order accepted:", data);

      // Refresh current and available orders
      getCurrentOrder();
      // getAssignment();
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  // ✅ Get currently assigned order
 const getCurrentOrder = async () => {
  console.log("📞 getCurrentOrder() CALLED");

  try {
    const result = await fetch("https://vingo-sozm.onrender.com/api/order/get-current-order", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await result.json();

    console.log("📩 getCurrentOrder() RESPONSE DATA:", data);
    console.log("📡 Status:", result.status);

    if (!result.ok) {
      console.error("❌ Error:", data.message);
      return;
    }

    setCurrentOrder(data);
  } catch (err) {
    console.error("❌ Network or fetch error in getCurrentOrder:", err);
  }
};


  // ✅ Fetch assignments and current order on load or when userData changes
  useEffect(() => {
     console.log("👀 useEffect triggered with userData:", userData);
    if (userData) {
      getAssignment();
      getCurrentOrder();
    }
  }, [userData]);


  const sendOtp = async () => {
  try {
    const result = await fetch(`https://vingo-sozm.onrender.com/api/order/send-delivery-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
      }
      ),
    });

    const data = await result.json();

    if (!result.ok) {
      console.error("❌ Send OTP Error from server:", data.message);
      alert(data.message || "Failed to send OTP.");
      return;
    }

    setShowOtpBox(true);
    alert(data.message || "OTP sent successfully!");
    console.log("✅ Send OTP Response:", data);
  } catch (err) {
    console.error("❌ Send OTP Fetch failed:", err);
    alert("Something went wrong while sending OTP.");
  }
};

const verifyOtp = async () => {
  try {
    const result = await fetch(`https://vingo-sozm.onrender.com/api/order/verify-delivery-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      // ✅ FIX: JSON.stringify takes ONE object only
      body: JSON.stringify({
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
        otp, // ← this was missing inside the JSON object
      }),
    });

    const data = await result.json();

    if (!result.ok) {
      console.error("❌ Verify OTP Server Error:", data.message);
      alert(data.message || "Invalid OTP.");
      return;
    }

    alert(data.message || "OTP verified successfully!");
    console.log("✅ Verify OTP Response:", data);
  } catch (err) {
    console.error("❌ OTP Verify Error:", err);
    alert("Something went wrong while verifying OTP.");
  }
};




useEffect(() => {
  if (!socket || !userData?._id) return; // wait until both are ready

  console.log("🎧 Listening for newAssignment...", socket.id);

  // safer handler (with duplicate prevention + ObjectId fix)
  const handleNewAssignment = (data) => {
    console.log("📦 newAssignment event received:", data);

    if (String(data.sentTo) === String(userData._id)) {
      setAvailableAssignments((prev) => {
        const alreadyExists = prev.some(
          (a) => String(a.assignmentId) === String(data.assignmentId)
        );
        if (alreadyExists) return prev; // don't duplicate
        return [data, ...prev];
      });
    }
  };

  socket.on("newAssignment", handleNewAssignment);

  // optional: confirm socket connection
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  return () => {
    console.log("🧹 Removing newAssignment listener");
    socket.off("newAssignment", handleNewAssignment);
    socket.off("connect");
  };
}, [socket, userData?._id]);



  // const handleSetOtp=(e)=>{

     

  // }

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />

      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        {/* Delivery Boy Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center text-center gap-2 w-[90%] border border-orange-100">
          <h1 className="text-xl font-bold text-[#ff4d2d]">
            Welcome, {userData?.fullName || "Delivery Partner"}
          </h1>

          {userData?.location?.coordinates ? (
            <p className="text-[#ff4d2d]">
              <span className="font-semibold">Latitude:</span>{" "}
              {userData.location.coordinates[1]}{" "}
              <span className="font-semibold">| Longitude:</span>{" "}
              {userData.location.coordinates[0]}
            </p>
          ) : (
            <p className="text-gray-500 text-sm">Location not available</p>
          )}
        </div>

        {/* Show current order or available assignments */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-sm w-[90%] border">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders
            </h1>

            <div className="space-y-4">
              {availableAssignments.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <p className="text-sm font-semibold">{a.shopName}</p>
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {a.deliveryAddress?.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {a.items?.length || 0} items | ₹{a.subtotal}
                      </p>
                    </div>
                    <button
                      className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600"
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Available Orders</p>
              )}
            </div>

        
          </div>
        )}


        {currentOrder && <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
          
          
             <h2 className="text-lg font-bold mb-3">Current Order</h2>

             <div className="border rounded-lg p-4 mb-3">


                    <p className="font-semibold text-sm">{currentOrder?.shopOrder?.shop?.name}</p>
                      <p className="text-sm text-gray-500">{currentOrder?.deliveryAddress?.text}</p>
                      <p className="text-xs text-gray-400">{currentOrder.shopOrder.shopOrderItem?.length} item | {currentOrder.shopOrder.subtotal}</p>

              </div>

               
                 
 <DeliveryBoyTracking  data={currentOrder}/>

{!showOtpBox ? <button className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200" onClick={sendOtp}> 
      Mark as Deliverd
   </button> : <div className="mt-4 p-4 border rounded-xl bg-gray-50">
    
       <p className="text-sm font-semibold mb-2">Enter Otp send to <span className="text-orange-500 ">{currentOrder.user.fullName} </span></p>
        <input type="text" value={otp} className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Enter OTP" onChange={(e)=>setOtp(e.target.value)}/>


          <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all" onClick={verifyOtp}> Submit OTP </button>
     </div>}
   
       
     
             </div>
         
          
          }

        {/* Future: Show current order card here if you want */}
      </div>
    </div>
  );
}

export default DeliveryBoy;
