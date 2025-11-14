import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import BookCard from "../components/BookCard";
import { getStaticBooks } from "../utils/staticBooks";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {

  const [booksByCategory, setBooksByCategory] = useState({});

  useEffect(() => {
    const data = getStaticBooks();   // Load JSON
    setBooksByCategory(data);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
  };

  const categories = Object.keys(booksByCategory); // fiction, fantasy, etc

  return (
    <div className="p-6 w-full">

      {categories.map((category) => {
        const books = booksByCategory[category] || []; // FIXED HERE

        return (
          <div key={category} className="mb-16">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>

            <div className="w-full">
              {books.length > 0 ? (
                <Slider {...settings}>
                  {books.map((book) => (
                    <div key={book.id} className="px-3">
                      <BookCard book={book} showReadButton={true} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <p className="text-gray-500">No books found.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
