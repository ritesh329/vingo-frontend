import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity, setCurrentAddress, setStateName, setUserData } from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';

const useGetCity = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const apikey = import.meta.env.VITE_GEOAPIKEY;
      dispatch(setLocation({lat:latitude,lon:longitude}))
      const result = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await result.json();
      console.log("this is user city of data ",data);

      dispatch(setCity(data.results[0].city));
      dispatch(setStateName(data.results[0].state));
      dispatch(setCurrentAddress(data.results[0].address_line1));
         dispatch(setAddress(data.results[0].formatted))
    });
  }, [dispatch, userData]);
};

export default useGetCity;
