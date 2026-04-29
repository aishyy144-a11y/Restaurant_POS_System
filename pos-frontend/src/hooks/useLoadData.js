import { useDispatch } from "react-redux";
import { getUserData } from "../https";
import { useEffect, useState } from "react";
import { removeUser, setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const useLoadData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // No token → remove user and redirect
        dispatch(removeUser());
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await getUserData(); // getUserData should include token in headers
        if (data?.data) {
          const { _id, name, email, phone, role } = data.data;
          dispatch(setUser({ _id, name, email, phone, role }));
        } else {
          throw new Error("Invalid user data");
        }
      } catch (error) {
        console.log(error);
        dispatch(removeUser());
        localStorage.removeItem("token"); // remove invalid token
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return isLoading;
};

export default useLoadData;
