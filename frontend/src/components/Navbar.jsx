import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Moon, Sun, NotebookPen, User } from "lucide-react";
import { useAuth } from "../context/ContextProvider";

const Navbar = ({setQuery}) => {
  const { user, handleLogout } = useAuth();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-50 border-b shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2 text-indigo-400 dark:text-indigo-400"
        >
          <NotebookPen size={30} />
          <span className="text-2xl font-bold">NoteApp</span>
        </Link>

        {/* Search */}

        <div className="items-center hidden px-4 py-2 bg-gray-100 rounded-full md:flex w-96 dark:bg-gray-800">
          <Search size={18} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search notes..."
            className="w-full ml-2 text-gray-700 placeholder-gray-500 bg-transparent outline-none dark:text-white"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-4">
          {/* Dark Mode */}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 duration-300 bg-gray-200 rounded-full dark:bg-gray-700 hover:scale-110"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-black-400" size={20} />
            )}
          </button>

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-indigo-300 transition border border-indigo-300 rounded-lg hover:bg-indigo-600 hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* Username */}

              <div className="flex items-center gap-2 text-gray-700 dark:text-white">
                <User size={20} />

                <span className="font-semibold">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
