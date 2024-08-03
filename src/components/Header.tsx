import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { WebcamIcon } from "@/lib/icons";
import { ModeToggle } from "./mode-toggle";
import { clearAccessToken } from "@/lib/helper"; // Adjust the path as needed
import { resetState } from "@/store/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(resetState());
    clearAccessToken();
    //Remove acess token
    //Remove User Info
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <WebcamIcon className="h-6 w-6" />
          <span className="text-lg font-medium">Chat App</span>
        </NavLink>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
