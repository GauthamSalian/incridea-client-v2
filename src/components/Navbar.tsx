import { NavLink } from "react-router-dom";
import { User } from "lucide-react";

interface NavbarProps {
  token: string | null;
  userName: string | null;
  onLogout: () => void;
  isLoading: boolean;
}

const Navbar = ({ token, userName, onLogout, isLoading }: NavbarProps) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-14 py-4 flex justify-between items-center bg-transparent">
      {/* Logo */}
      <NavLink to="/" className="flex items-center  cursor-target">
        <img src="/i.png" alt="Incridea" className="h-20 w-auto" />
      </NavLink>

      {/* Center Links */}
      <div className="hidden md:flex gap-12 absolute left-1/2 -translate-x-1/2">
        <NavLink
          to="/events"
          className={({ isActive }) =>
            `font-['Orbitron'] text-3xl tracking-widest font-bold uppercase transition-colors duration-300 cursor-target ${
              isActive ? "text-purple-400" : "text-white hover:text-purple-300"
            }`
          }
        >
          Events
        </NavLink>
        <NavLink
          to="/pronite"
          className={({ isActive }) =>
            `font-['Orbitron'] text-3xl tracking-widest font-bold uppercase transition-colors duration-300 cursor-target ${
              isActive ? "text-purple-400" : "text-white hover:text-purple-300"
            }`
          }
        >
          Pronite
        </NavLink>
      </div>

      {/* Right User Section */}
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-4">
            <a
              href={`${import.meta.env.VITE_MAIN_URL}/profile`}
              className="hidden md:flex items-center gap-2 text-white hover:text-purple-300 transition-colors font-['Orbitron'] text-sm  cursor-target"
              title="Profile"
            >
              <User size={18} />
              <span className="uppercase tracking-wide">{userName}</span>
            </a>
            <button
              onClick={onLogout}
              className="
                px-6 py-2 rounded-md
                bg-[#5b21b6] hover:bg-[#4c1d95]
                text-white font-['Orbitron'] font-bold tracking-wider text-sm
                uppercase
                transition-all duration-300
                skew-x-[-10deg]
                cursor-target
              "
              title="Logout"
            >
              <span className="block skew-x-10">Logout</span>
            </button>
          </div>
        ) : (
          !isLoading && (
            <NavLink
              to="/login"
              className="
                px-6 py-2 rounded-md
                bg-[#5b21b6] hover:bg-[#4c1d95]
                text-white font-['Orbitron'] font-bold tracking-wider text-sm
                uppercase
                transition-all duration-300
                skew-x-[-10deg]
              "
            >
              <span className="block skew-x-10">Sign In</span>
            </NavLink>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;
