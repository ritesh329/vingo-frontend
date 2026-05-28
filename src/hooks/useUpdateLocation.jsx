import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity, setCurrentAddress, setStateName, setUserData } from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';

const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {

    const updateLocation = async (lat, lon) => {


      const result = await fetch(
        `https://vingo-sozm.onrender.com/api/user/update-location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat, lon }),
          credentials: 'include'
        }
      );

       const data = await result.json();

    console.log("this is use update location", data);

    }


    navigator.geolocation.watchPosition((pos)=>{
            
         updateLocation(pos.coords.latitude,pos.coords.longitude)
    })


 



    // dispatch(setCity(data.results[0].city));
    // dispatch(setStateName(data.results[0].state));
    // dispatch(setCurrentAddress(data.results[0].address_line1));
    // dispatch(setAddress(data.results[0].formatted))

}, [dispatch, userData]);
};

export default useUpdateLocation;
