import React from "react"
import Wrapper from "../components/Wrapper";
import BottomNav from "../components/BottomNav.jsx";
import { ToastContainer } from 'react-toastify';
import { Outlet } from "react-router-dom";

export default function MainLayout()
{
  return (
    <>
      <Wrapper>
        <Outlet />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="light"
        />
        <BottomNav />
      </Wrapper>
    </>
  );
}