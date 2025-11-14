import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookContext } from "../contexts/BookContext";

export default function Navbar() {
  const { user, setUser } = useContext(BookContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ---------------------- SESSION CHECK -----------------------
  useEffect(() => {
    if (!user) return;

    const checkSession = async () => {
      try {
        const res = await axios.get(
          "https://librarybackend-woev.onrender.com/api/session-check",
          { withCredentials: true }
        );

        if (!res.data) {
          localStorage.removeItem("user");
          setUser(null);
          alert("Session expired! Please log in again.");
          navigate("/login");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };

    checkSession();
  }, []);

  // ---------------------- LOGOUT -----------------------
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://library-backend-woev.onrender.com/api/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log("Logout error:", err);
    }

    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ---------------------- SEARCH -----------------------
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery("");
    }
  };

  // ---------------------- GENRES -----------------------
  const genres = [
    "Fiction",
    "Fantasy",
    "Romance",
    "Mystery",
    "Science",
    "Biography",
    "History",
    "Horror",
    "Poetry",
    "Adventure"
  ];

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">

      {/* Logo */}
      <Link to="/" className="text-2xl font-semibold text-blue-700">
        📚 BookStore
      </Link>

      {/* Browse Dropdown */}
      <div className="relative group focus-within:block">
        <button className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
          Browse 🔻
        </button>

        <div className="
          absolute left-0 top-full
          hidden group-hover:block group-focus-within:block
          bg-white shadow-md rounded-md w-40 z-50
        ">
          {genres.map((genre) => (
            <Link
              key={genre}
              to={`/category/${genre.toLowerCase()}`}
              className="block px-4 py-2 hover:bg-blue-100 text-gray-700"
            >
              {genre}
            </Link>
          ))}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search books..."
          className="border border-gray-300 rounded-md px-3 py-1
            focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Right section */}
      <div className="flex items-center space-x-4">

        <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 font-medium">
          Favourite ❤️
        </Link>

        {user ? (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700">{user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-red-600 font-medium hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex space-x-3">
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
