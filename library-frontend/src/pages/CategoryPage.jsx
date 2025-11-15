import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import booksData from "../data/booksData.json";  // ✅ correct path

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const key = categoryName.toLowerCase();
    setBooks(booksData[key] || []);
  }, [categoryName]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-blue-700 mb-4">
        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Books
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-600">No books found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} showReadButton={true} />
          ))}
        </div>
      )}
    </div>
  );
}
