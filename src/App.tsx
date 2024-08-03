import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store/store";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import PublicRoute from "./components/PublicRoute";
import { getAccessToken } from "./lib/helper";
import { useAppSelector } from "./store/hooks";
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ChatLayout = lazy(() => import("./pages/ChatLayout"));

const App = () => {
  return (
    <Provider store={store}>
      <div className="">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route path="/chat" element={<ChatLayout />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    </Provider>
  );
};

export default App;
