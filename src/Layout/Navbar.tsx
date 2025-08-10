import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { throttle } from "lodash";
import { TiThMenu } from "react-icons/ti";
import { useSelector, useDispatch } from "react-redux";
import Buttons from "@/reusable/AllButtons";
import { RootState } from "../store/store"; // Adjust path
import { logout as logoutAction } from "../store/Slices/AuthSlice/authSlice"; // Adjust path

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.userData);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll listener (throttled)
  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 50);
    }, 100);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu options - show dashboard based on role
  const middleMenuOptions = [
    { name: "Home", to: "/" },
    { name: "Test Exam", to: "/test-exam"},
    { name: "Features", to: "/features" },
    { name: "Pricing", to: "/pricing" },
    { name: "Contact Us", to: "/Contact-Us" },
    ...(user?.role === "user"
      ? [{ name: "Dashboard", to: "/userDashboard/mockInterview" }]
      : user?.role === "admin"
      ? [{ name: "Dashboard", to: "/userDashboard/dashboard" }]
      : []),
  ];

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[1000]">
      <div
        className={`max-w-screen mx-auto backdrop-blur-md bg-black/10 ${
          scrolled
            ? "bg-emerald-500 shadow-md transition-all duration-150"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto lg:px-12 md:px-12 px-6 py-3 flex items-center justify-between">
          {/* Left: Logo & Mobile Menu */}
          <div className="navbar-start flex items-center">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-[#37B874] border-none lg:hidden rounded-xl focus:outline-none"
              aria-label="Toggle menu"
            >
              <TiThMenu
                className={`h-8 w-8 ${
                  scrolled ? "text-white" : "text-[#37B874]"
                }`}
              />
            </button>

            {/* Mobile menu dropdown */}
            {menuOpen && (
              <ul className="menu menu-sm dropdown-content mt-12 z-[1001] w-52 rounded-box bg-white p-2 shadow absolute top-full left-4 lg:hidden">
                {middleMenuOptions.map((item, index) => (
                  <li key={index} onClick={() => setMenuOpen(false)}>
                    <Buttons.NormalLinkButton text={item.name} to={item.to} />
                  </li>
                ))}
              </ul>
            )}

            {/* Logo */}
            <Link to="/" className="ml-4">
              <img
                src="https://play-lh.googleusercontent.com/Hm6SFYDWM4qof6maHMQOBKHMmO8WTb0AyumNFWAw1yGiEB1WGSemw6IJJ7h6G934"
                alt="logo"
                className="h-16 w-16 rounded-full"
              />
            </Link>
          </div>

          {/* Middle: Desktop Menu */}
          <div className="navbar-center hidden lg:flex">
            <ul className="flex gap-6 list-none p-0 m-0">
              {middleMenuOptions.map((item, index) => (
                <li key={index}>
                  <Buttons.NormalLinkButton
                    text={item.name}
                    to={item.to}
                    textColor={scrolled ? "text-white" : "text-black"}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Auth Buttons */}
          <div className="navbar-end">
            {user ? (
              <Buttons.OnClickButton
                text="Log Out"
                onClick={handleLogout}
                height="h-[44px]"
                width="w-[94px]"
                textColor={scrolled ? "text-[#37B874] bg-white" : "text-[#FFF]"}
              />
            ) : (
              <div className="flex items-center gap-4">
                <Buttons.LinkButton
                  text="Log In"
                  to="/login"
                  height="h-[32px] md:h-[44px] lg:h-[44px]"
                  width="w-[72px] md:w-[94px] lg:w-[94px]"
                  textColor={
                    scrolled ? "text-[#37B874] bg-white" : "text-[#FFF]"
                  }
                />
                <Buttons.LinkButton
                  text="Sign Up"
                  to="/signup"
                  height="h-[32px] md:h-[44px] lg:h-[44px]"
                  width="w-[72px] md:w-[94px] lg:w-[94px]"
                  textColor={
                    scrolled ? "text-[#37B874] bg-white" : "text-[#FFF]"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
