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
  <div className="px-4 py-4 w-full bg-gray-50 min-h-screen pt-24">

    {categories.map((category, idx) => {
      const books = booksByCategory[category] || [];

      return (
        <div
          key={category}
          className="mb-16"
        >
          {/* CATEGORY HEADER */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 tracking-wide">
              {category.charAt(0).toUpperCase() + category.slice(1)} Books
            </h2>
          </div>

          {/* SLIDER */}
          <div className="w-full relative">
            {books.length > 0 ? (
              <Slider {...settings}>
                {books.map((book) => (
                  <div key={book.id} className="!flex justify-center px-2">
                    <div className="w-[140px] sm:w-[160px] md:w-[180px]">
                      <BookCard book={book} showReadButton={true} />
                    </div>
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
