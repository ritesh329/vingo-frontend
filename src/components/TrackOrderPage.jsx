import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { DeliveryBoyTracking } from "./DeliveryBoyTracking";
import { useSelector } from "react-redux";

function TrackOrderPage() {
  const token = localStorage.getItem("token");
  const { orderId } = useParams();
  const [orderCurrent, setOrderCurrent] = useState(null);
  const {socket}=useSelector(state=>state.user);
  const navigate = useNavigate();
  const [liveLocations,setLiveLocations]=useState({});
  const handleGetOrder = async () => {
    try {
      const result = await fetch(`https://vingo-sozm.onrender.com/api/order/get-order-by-id/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
        credentials: "include"
      });

      const data = await result.json();

      if (!result.ok) {
        console.error("This is error in get order track:", data.message);
        alert(data.message || "Failed to fetch order.");
        return;
      }

      setOrderCurrent(data);
      alert("Fetch successful, tracking the order.");
      console.log("Order data:", data);

    } catch (err) {
      console.error("This is error while getting the order data:", err);
      alert("Error getting the order data.");
    }
  };


 useEffect(() => {
  if (!socket) return;
  
   console.log("jkuuuiiiiiiiieiieiiei");
   
  // Handler function
  const handleLocationUpdate = ({ deliveryBoyId, latitude, longitude }) => {
    setLiveLocations((prev) => ({
      ...prev,
      [deliveryBoyId]: { lat: latitude, lon: longitude },
    }));
  };
  console.log("this is live location",liveLocations);

  // Register listener
  socket.on("updateDeliveryLocation", handleLocationUpdate);

  // Cleanup on unmount or when socket changes
  return () => {
    socket.off("updateDeliveryLocation", handleLocationUpdate);
  };
}, [socket]);




  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 z-10 cursor-pointer"
      >
        <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
      </button>

      {/* Order info rendering */}
      {orderCurrent?.shopOrders.map((shopOrder, index) => (
        <div key={index} className="bg-white p-4 rounded-2xl shadow-md border space-y-4">

          <div>
            <p className="text-lg font-bold mb-2 text-[#ff4d2d]">
              {shopOrder.shop?.name}
            </p>
            <p className="font-semibold">
              <span>Items: </span>{shopOrder.shopOrderItem.map(i => i.name).join(", ")}
            </p>
            <p><span>Subtotal: </span>{shopOrder.subtotal}</p>
            <p><span>Delivery Address: </span>{orderCurrent.deliveryAddress?.text}</p>
          </div>

          {shopOrder.status !== "delivered" ? (
            <>
              <h2 className="text-md font-bold">Delivery Boy</h2>

              {shopOrder.assignedDeliveryBoy ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold">
                    <span>Delivery Boy Name: </span>{shopOrder.assignedDeliveryBoy.fullName}
                  </p>
                  <p className="font-semibold">
                    <span>Mobile Number: </span>{shopOrder.assignedDeliveryBoy.mobileNo}
                  </p>
                </div>
              ) : (
                <p className="font-semibold">Delivery Boy is not assigned yet</p>
              )}
            </>
          ) : (
            <p className="font-semibold">Delivered</p>
          )}
 
          {/* Delivery tracking */}
          {shopOrder.assignedDeliveryBoy && shopOrder.status!="delivered" && (
            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation:liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                  lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                  lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                },
                customerLocation: {
                  lat: orderCurrent.deliveryAddress.latitude,
                  lon: orderCurrent.deliveryAddress.longitude
                }
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default TrackOrderPage;
