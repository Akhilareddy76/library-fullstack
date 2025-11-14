import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import BookDetails from "./pages/BookDetails";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import SearchResults from "./pages/SearchResults";
import { BookProvider } from "./contexts/BookContext";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <BookProvider>
      <Router>
        <Navbar />
        {/* FIX: remove container width limit */}
        <div className="w-full px-6 mt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/book/:bookId" element={<BookDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
           <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </BookProvider>
  );
}

export default App;
