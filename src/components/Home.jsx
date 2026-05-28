import React from "react";
import { useSelector } from "react-redux";
import DeliveryBoy from "./DeliveryBoy";
import OwnerDashBoard from "./OwnerDashBoard";
import UserDashBoard from "./UserDashBoard";

function Home() {
  const { userData } = useSelector((state) => state.user);

  const renderDashboard = () => {
    switch (userData?.role) {
      case "user":
        return <UserDashBoard />;
      case "owner":
        return <OwnerDashBoard />;
      case "deliveryBoy":
        return <DeliveryBoy />;
      default:
        return null; // fallback if role is missing
    }
  };

  return (
    <div className="flex flex-col items-center w-screen min-h-screen pt-24 bg-[#fff9f6]">
      {renderDashboard()}
    </div>
  );
}

export default Home;
