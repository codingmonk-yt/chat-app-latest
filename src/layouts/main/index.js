import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const MainLayout = () => {

  const {isLoggedIn} = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }
  return (
    <>
      <div>Main Layout</div>

      <Outlet />
    </>
  );
};

export default MainLayout;
