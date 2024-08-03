import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import Header from "./Header";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { getAccessToken } from "@/lib/helper";

const ProtectedRoute = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();
  const token = getAccessToken();

  if (userInfo == null) {
    return <Navigate to="/login" replace />;
  }
  const websocketUrl = `ws://127.0.0.1:8080/ws/${token}`;

  const isAuthenticated = userInfo != null;
  if (token === null) {
    navigate("/login");
  }
  return (
    <>
      <Header />
      <WebSocketProvider url={websocketUrl} isAuthenticated={isAuthenticated}>
        <Outlet />
      </WebSocketProvider>
    </>
  );
};

export default ProtectedRoute;
