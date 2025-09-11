import { useLocation, useNavigate, Link } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Gnayanlogo } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useEffect, useState } from "react";

// ✅ shadcn/ui components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const apiBase = import.meta.env.VITE_API_BASE;

const Header = () => {
  const pathname = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // ✅ null until fetched

  // ✅ Check login + fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetch(`${apiBase}/Get_patient_Clinical_and_PREDICTION_data/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({
            name: `${data.first_name} ${data.last_name}`,
            email: data.email,
            username: data.username,
            avatar: data.avatar_url || "", // fallback if no avatar
            role:data.role,
          });
        })
        .catch((err) => {
          console.error("Profile fetch error:", err);
        });
    }
  }, [pathname]);

  const toggleNavigation = () => {
    setOpenNavigation((prev) => {
      if (!prev) disablePageScroll();
      else enablePageScroll();
      return !prev;
    });
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navItems = isLoggedIn
    ? [
      ...navigation.filter((item) => item.title.toLowerCase() !== "login"),
      { id: "99", title: "Patient Records", url: "/patient-records" },
    ]
    : navigation;

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-2 lg:bg-n-1/90 lg:backdrop-blur-sm ${openNavigation ? "bg-n-1" : "bg-n-1/90 backdrop-blur-sm"
        }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-0" href="/">
          <img src={Gnayanlogo} width={60} height={60} alt="G-nayan" />
        </a>

        {/* Navigation */}
        <nav
          className={`${openNavigation ? "flex" : "hidden"
            } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-1 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-8 transition-colors hover:text-color-1 ${item.onlyMobile ? "lg:hidden" : ""
                  } px-2 py-2 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${item.url === pathname.hash
                    ? "z-2 lg:text-n-8"
                    : "lg:text-n-8/50"
                  } lg:leading-5 lg:hover:text-n-8 xl:px-8`}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <HamburgerMenu />
        </nav>

        {/* Avatar Menu if logged in */}
        {isLoggedIn && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="ml-auto cursor-pointer">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile Settings
                </DropdownMenuItem>
                {user?.role === "superadmin" && (
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                )}

              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 font-semibold ">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            className="ml-auto lg:hidden"
            px="px-3"
            onClick={toggleNavigation}
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
