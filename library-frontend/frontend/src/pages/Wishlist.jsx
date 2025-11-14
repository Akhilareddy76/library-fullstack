import React, { useContext } from "react";
import { BookContext } from "../contexts/BookContext";
import BookCard from "../components/BookCard";

function Wishlist() {
  const { user, wishlist } = useContext(BookContext);

  if (!user) {
    return <p className="p-6 text-red-600">Please login to see your wishlist.</p>;
  }

  if (!wishlist || wishlist.length === 0) {
    return <p className="p-6">Your wishlist is empty.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-blue-700 mb-4">My Wishlist</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {wishlist.map((book) => {
          const key = book.bookId || book.id || book.key || book._id || JSON.stringify(book).slice(0,8);
          return (
            <BookCard
              key={key}
              book={book}
              showReadButton={true}
              showRemoveButton={true}
              showWishlistButton={false}
            />
          );
        })}
      </div>
    </div>
  );
}
export default Wishlist;
