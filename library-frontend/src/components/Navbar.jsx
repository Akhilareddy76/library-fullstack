import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api";
import { BookContext } from "../contexts/BookContext";
import { Menu, X } from "lucide-react"; // icons

export default function Navbar() {
  const { user, setUser } = useContext(BookContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ---------------- SESSION CHECK ----------------
  useEffect(() => {
    if (!user) return;

    const checkSession = async () => {
      try {
        const res = await axios.get("/api/session-check", {
          withCredentials: true,
        });

        if (!res.data) {
          localStorage.removeItem("user");
          setUser(null);
          alert("Session expired! Login again.");
          navigate("/login");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };

    checkSession();
  }, []);

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error:", err);
    }

    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ---------------- SEARCH ----------------
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  const genres = [
    "Fiction", "Fantasy", "Romance","Science",
    "Biography", "History", "Horror", "Poetry", "Adventure"
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-4 flex justify-between items-center z-50">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold font-mono text-blue-700 tracking-tight"
        >
          📚 <span className="text-red-600">R</span>ead
          <span className="text-red-600">F</span>low
        </Link>

        {/* Hamburger Icon (Mobile) */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">

          {/* Browse Dropdown */}
          <div className="relative group">
            <button className="px-2 py-1 text-gray-700 hover:text-blue-600 font-medium">
              Browse ▼
            </button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-md rounded-md w-40 z-50">
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
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Wishlist */}
          <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 font-medium">
            ❤️ Favourite
          </Link>

          {/* Auth Buttons */}
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700">{user.email}</span>
              </div>

              <button onClick={handleLogout} className="text-red-600 font-medium">
                Logout
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="text-blue-600">Login</Link>
              <Link to="/signup" className="text-blue-600">Signup</Link>
            </div>
          )}
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-blue-700">Menu</h2>
          <button onClick={() => setMenuOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* Search */}
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              className="w-full border px-3 py-2 rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Browse */}
          <p className="font-semibold text-gray-700">Browse</p>
          <div className="space-y-2">
            {genres.map((g) => (
              <Link
                key={g}
                to={`/category/${g.toLowerCase()}`}
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                {g}
              </Link>
            ))}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="block text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
            ❤️ Favourite
          </Link>

          {/* Auth */}
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-600 font-semibold"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="block text-blue-600" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="block text-blue-600" onClick={() => setMenuOpen(false)}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
