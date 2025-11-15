import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import BookCard from "../components/BookCard";
import { getStaticBooks } from "../utils/staticBooks";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [booksByCategory, setBooksByCategory] = useState({});

  useEffect(() => {
    const data = getStaticBooks();
    setBooksByCategory(data);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4, slidesToScroll: 4 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const categories = Object.keys(booksByCategory);

  return (
    <div className="px-6 py-4 w-full bg-gray-50 min-h-screen">

      {categories.map((category, idx) => {
        const books = booksByCategory[category] || [];

        return (
          <div
            key={category}
            className="mb-16 animate-fadeIn"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {/* CATEGORY HEADER */}
            <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-semibold text-blue-700 mb-6">
  {            category.charAt(0).toUpperCase() + category.slice(1)} Books
             </h2>     
            </div>

            {/* CAROUSEL */}
            <div className="w-full relative">
              {books.length > 0 ? (
                <Slider {...settings}>
                  {books.map((book) => (
                    <div key={book.id} className="px-3">
                      <BookCard book={book} showReadButton={true} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <p className="text-gray-500 text-center">
                  No books available in this category.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
