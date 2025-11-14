import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BookContext } from "../contexts/BookContext";
import { getBookById } from "../utils/getBookById";

export default function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const { addToWishlist, user } = useContext(BookContext);

  useEffect(() => {
   
    const staticBook = getBookById(bookId);

    if (staticBook) {
      setBook(staticBook);
      return;
    }
    fetchOpenLibraryBook();
  }, [bookId]);

  const fetchOpenLibraryBook = async () => {
    try {
      const res = await axios.get(
        `https://openlibrary.org/works/${bookId}.json`
      );

      const cover = res.data.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${res.data.covers[0]}-L.jpg`
        : "/default-book.jpg";

      setBook({
        id: bookId,
        title: res.data.title,
        author: res.data.authors?.[0]?.name || "Unknown",
        cover,
        description:
          res.data.description?.value ||
          res.data.description ||
          "No description available.",
        year: res.data.created?.value?.slice(0, 4) || "Unknown",
        rating: "4.0",
        topics: [],
      });
    } catch (err) {
      console.error("Error loading OpenLibrary book:", err);
    }
  };

  const handleWishlist = () => {
    if (!user) return alert("Please login to add to favourites!");
    addToWishlist(book);
  };

  const handleRead = async () => {
    if (!user) {
      alert("Please login to read this book!");
      return;
    }

    try {
      const gut = await axios.get(
        `https://gutendex.com/books/?search=${encodeURIComponent(book.title)}`
      );

      const match = gut.data.results.find((b) =>
        b.title.toLowerCase().includes(book.title.toLowerCase())
      );

      if (match) {
        const f = match.formats;

        if (f["text/html"]) return window.open(f["text/html"], "_blank");
        if (f["application/pdf"]) return window.open(f["application/pdf"], "_blank");
        if (f["text/plain"]) return window.open(f["text/plain"], "_blank");
        if (f["application/epub+zip"])
          return window.open(f["application/epub+zip"], "_blank");
      }

      window.open(`https://openlibrary.org/works/${bookId}`, "_blank");
    } catch {
      alert("Could not open book.");
    }
  };

  if (!book)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">

        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl shadow">
            <img
              src={book.cover}
              alt={book.title}
              className="w-64 h-80 object-cover rounded-lg"
            />
            <button
              onClick={handleRead}
              className="mt-4 w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded"
            >
              Read
            </button>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-lg text-gray-700 mb-4">by {book.author}</p>

          <div className="flex gap-6 mb-6">
            <p className="text-gray-700"><b>Year:</b> {book.year}</p>
            <p className="text-gray-700"><b>Rating:</b> ⭐ {book.rating}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {book.topics?.map((t, i) => (
              <span key={i} className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded-full">
                {t}
              </span>
            ))}
          </div>

          <p className="text-gray-800 text-lg leading-relaxed mb-8">
            {book.description}
          </p>

          <button
            onClick={handleWishlist}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg shadow"
          >
            ❤️ Add to Favourites
          </button>
        </div>
      </div>
    </div>
  );
}
