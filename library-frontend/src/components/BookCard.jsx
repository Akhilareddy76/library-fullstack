import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BookContext } from "../contexts/BookContext";

export default function BookCard({
  book,
  showReadButton = true,
  showWishlistButton = true,
  showRemoveButton = false,
}) {
  const { addToWishlist, removeFromWishlist, user } = useContext(BookContext);
  const navigate = useNavigate();

  // Resolve ID from as many shapes as possible
  let rawId = "";

  if (book.bookId) rawId = book.bookId;                 // backend wishlist shape
  else if (typeof book.id === "string") rawId = book.id; // static JSON: "/works/OL..."
  else if (typeof book.key === "string") rawId = book.key; // openlibrary search: key
  else if (Array.isArray(book.seed)) {
    rawId = book.seed.find((s) => typeof s === "string" && s.startsWith("/works/")) || "";
  }

  // Normalize to the route id (no leading /works/)
  const bookId = rawId ? rawId.replace(/^\/?works\/?/, "") : "";

  // Prefer image fields (backend->image, static->cover, openlib->cover_i converted earlier)
  const cover = book.image || book.cover || book.cover_i && `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` || "/default-book.jpg";

  const title = book.title || book.name || "Untitled";
  const author = book.author || book.author_name?.[0] || "Unknown";

  const handleRead = () => {
    if (!bookId) {
      // fallback: if no work id, try opening openlibrary url if present
      if (book.openLibraryUrl) return window.open(book.openLibraryUrl, "_blank");
      return alert("Sorry — no readable version found for this book.");
    }
    navigate(`/book/${bookId}`);
  };

  const handleWishlist = () => {
    if (!user) return alert("Please login!");
    // Normalize payload we send to backend
    addToWishlist({
      bookId: book.bookId || bookId || book.id || book.key,
      title,
      author,
      image: cover,
    });
  };

  const handleRemove = () => {
    // when removing, backend expects bookId
    const idToRemove = book.bookId || bookId || book.id || book.key;
    if (!idToRemove) return console.warn("No id to remove:", book);
    removeFromWishlist(idToRemove);
  };

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md p-3 bg-white">
      <img
        src={cover}
        alt={title}
        className="h-48 w-full object-cover rounded-md cursor-pointer"
        onClick={handleRead}
      />

      <h3 className="text-sm font-medium mt-2">{title}</h3>
      <p className="text-xs text-gray-500">{author}</p>

      <div className="flex justify-between mt-2">
        {showReadButton && (
          <button onClick={handleRead} className="text-blue-600 text-sm font-semibold hover:underline">
            Read
          </button>
        )}

        {showWishlistButton && !showRemoveButton && (
          <button onClick={handleWishlist} className="text-pink-600 text-sm font-semibold hover:underline">
            Favourite
          </button>
        )}

        {showRemoveButton && (
          <button onClick={handleRemove} className="text-red-600 text-sm font-semibold hover:underline">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
