/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";

// const Navbar = () => {
//   return (
//     <div className="inear-gradient(180deg, #DC3C3C 0%, #000000 100%">
//       <header className=" flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-gradient-to-r from-rose-950/80 to-black/80 backdrop-blur-md">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-700 flex items-center justify-center text-white font-extrabold text-sm ring-2 ring-rose-500/40">
//             M
//           </div>
//           <div>
//             <p className="text-white/40 text-[10px] uppercase tracking-widest">
//               Good Evening
//             </p>
//             <p className="text-white font-bold text-sm leading-tight">Mahir</p>
//           </div>
//         </div>

//         {/* Title — hidden on small screens to save space
//         <div className="absolute left-1/2 -translate-x-1/2 text-center hidden sm:block">
//           <h1 className="text-amber-400 font-extrabold text-lg sm:text-xl tracking-tight leading-tight">
//             Internet Bachelor
//           </h1>
//           <p className="text-white/30 uppercase text-[10px] tracking-[0.35em] font-semibold">
//             {screen === "lobby"
//               ? "Lobby"
//               : screen === "waiting"
//                 ? "Waiting Room"
//                 : "Live Duel"}
//           </p>
//         </div> */}

//         {/* Settings icon */}
//         <button className="w-9 h-9 rounded-lg bg-rose-700/70 hover:bg-rose-600/80 flex items-center justify-center transition-colors group">
//           <svg
//             className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path
//               fillRule="evenodd"
//               d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//       </header>
//     </div>
//   );
// };

// export default Navbar;

"use client";
import { useState, useRef, useEffect } from "react";
import Button from "../share/ButtonPrimary";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/user/userSlice";

const Navbar = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const currentUser = useSelector((state: any) => state.user.user);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      Cookies.remove("accessToken"); // removes the token cookie
      router.push("/login");
      setLoggingOut(false);
      dispatch(logout());
    }, 1000);
  };

  return (
    <div
      className="w-full py-4"
      style={{
        background:
          "linear-gradient(0deg, rgba(152, 13, 24, 0.95) 0%, rgba(80, 0, 6, 0.95) 15.35%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left Profile Card */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-md cursor-pointer"
        >
          <img
            src={currentUser?.avatar || "https://i.pravatar.cc/100"}
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-white/70 text-xs">Good Evening</p>
            <p className="text-white font-semibold text-sm">
              {currentUser?.name}
            </p>
          </div>
        </div>

        {/* Right Settings Button + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="game"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <svg
              className={`w-6 h-6 text-white transition-transform duration-300 ${dropdownOpen ? "rotate-45" : "rotate-0"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </Button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-2xl z-50 border border-white/10"
              style={{
                background: "rgba(80, 0, 6, 0.97)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Settings Item */}
              <button
                onClick={() => {
                  // router.push("/settings");
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 text-white/70"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Settings
              </button>

              {/* Divider */}
              <div className="h-px bg-white/10 mx-3" />

              {/* Logout Item */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/20 transition-colors duration-200 disabled:opacity-60"
              >
                {loggingOut ? (
                  <>
                    {/* Spinner */}
                    <svg
                      className="w-4 h-4 animate-spin text-red-300"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Logging out...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 text-red-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                      />
                    </svg>
                    Logout
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen logout overlay */}
      {loggingOut && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <svg
            className="w-10 h-10 animate-spin text-white mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-white text-lg font-semibold">Logging out...</p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
