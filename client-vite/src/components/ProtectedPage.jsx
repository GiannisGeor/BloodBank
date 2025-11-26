import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { getLoggedinUserName } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";

export default function ProtectedPage({ children }) {
  const { currentUser } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetCurrentUser();
      dispatch(SetLoading(false));

      if (response.success) {
        message.success(response.message);
        dispatch(SetCurrentUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(SetCurrentUser(null));
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    currentUser && (
      <div>
        {/* header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-primary text-black px-5 sm:px-5 py-3 mx-4 sm:mx-5 rounded-b gap-3 sm:gap-0">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <h1 className="text-xl sm:text-2xl">Κέντρο Αιμοδοσίας</h1>
            <span className="text-xs">
              {currentUser.userType.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <i className="ri-shield-user-line"></i>
            <div className="flex flex-col">
              <span
                className="text-sm sm:text-md cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                {getLoggedinUserName(currentUser).toUpperCase()}
              </span>
            </div>
            <i
              className="ri-logout-circle-r-line cursor-pointer"
              onClick={handleLogout}
            ></i>
          </div>
        </div>

        {/* body */}
        <div className="px-4 sm:px-5 py-5">{children}</div>
      </div>
    )
  );
}
