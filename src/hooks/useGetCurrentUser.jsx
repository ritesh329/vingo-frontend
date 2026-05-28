import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('https://vingo-sozm.onrender.com/api/user/Current', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' ,
          'authorization': `Bearer ${token}`
          },
          credentials: 'include',
        });

        const data = await res.json();
          console.log(data);
        if (res.ok ) {
          dispatch(setUserData(data.user)); // ✅ Redux में set
        } else {
          dispatch(setUserData(null)); // ❌ login नहीं है
        }
      } catch (err) {
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
