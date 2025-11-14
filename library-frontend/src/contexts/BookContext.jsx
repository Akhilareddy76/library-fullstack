import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const API = "https://librarybackend-lpkg.onrender.com/api";

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) {
      setUser(u);
      fetchWishlist(u.id);
    }
  }, []);

  const fetchWishlist = async (userId) => {
    try {
      const res = await axios.get(`${API}/wishlist/${userId}`, { withCredentials: true });
      console.log("Fetched wishlist:", res.data);
      setWishlist(res.data || []);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
      setWishlist([]);
    }
  };

  const addToWishlist = async (book) => {
    try {
      const body = {
        userId: user.id,
        bookId: book.bookId || book.id || book.key,
        title: book.title,
        author: book.author,
        image: book.image || book.cover,
      };

      const res = await axios.post(`${API}/wishlist/add`, body, { withCredentials: true });
      console.log("Add wishlist response:", res.data);
      await fetchWishlist(user.id);
    } catch (e) {
      console.error("Wishlist add error", e);
      alert("Could not add to wishlist.");
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      const res = await axios.delete(`${API}/wishlist/${user.id}/${bookId}`, { withCredentials: true });
      console.log("Remove wishlist response:", res.data);
      await fetchWishlist(user.id);
    } catch (e) {
      console.error("Wishlist remove error", e);
      alert("Could not remove from wishlist.");
    }
  };

  return (
    <BookContext.Provider value={{ user, wishlist, setUser, fetchWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </BookContext.Provider>
  );
};
