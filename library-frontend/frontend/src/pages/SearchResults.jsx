import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookCard from "../components/BookCard";

export default function SearchResults() {
  const { query } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        const formatted = data.docs.slice(0, 20).map((b) => ({
          id: b.key, // /works/OLxxxxW
          title: b.title,
          author: b.author_name ? b.author_name[0] : "Unknown",
          cover: b.cover_i
            ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`
            : "/default-book.jpg",
        }));

        setBooks(formatted);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-blue-700 mb-4">
        Search Results for "{query}"
      </h1>

      {loading ? (
        <p className="text-gray-600">Searching...</p>
      ) : books.length === 0 ? (
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
