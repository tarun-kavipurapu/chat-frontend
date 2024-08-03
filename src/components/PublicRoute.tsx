import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const PublicRoute = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  if (userInfo) {
    // If user is logged in, redirect them to the chat page or another appropriate page
    return <Navigate to="/chat" replace />;
  }

  // If user is not logged in, render the desired component (like Login or Signup)
  return <Outlet />;
};

export default PublicRoute;
