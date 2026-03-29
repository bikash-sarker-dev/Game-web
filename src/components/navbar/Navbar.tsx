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

import React from "react";

const Navbar = () => {
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
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-md">
          {/* Avatar */}
          <img
            src="https://i.pravatar.cc/100"
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Text */}
          <div>
            <p className="text-white/70 text-xs">Good Evening</p>
            <p className="text-white font-semibold text-sm">Mahir</p>
          </div>
        </div>

        {/* Right Settings Button */}
        <button className="w-12 h-12 rounded-xl bg-red-700/70 hover:bg-red-600 flex items-center justify-center shadow-lg transition">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
