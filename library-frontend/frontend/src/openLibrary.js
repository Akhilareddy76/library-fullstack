import axios from "axios";

// ⭐ Your deployed backend URL
const BACKEND_URL = "https://library-backend-lpkg.onrender.com/api/books";

export const getAllCategoriesBooks = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/all`, {
      withCredentials: true, // important for session cookies
    });

    return res.data || {};
  } catch (err) {
    console.error("Error fetching all books:", err);
    return {};
  }
};

// ⭐ OpenLibrary API (unchanged)
const BASE_URL = "https://openlibrary.org";

export const searchBooks = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/search.json?q=${query}&limit=5`);

    return res.data.docs.map((book) => ({
      id: book.key,
      title: book.title,
      author: book.author_name?.[0] || "Unknown Author",
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : "/default-book.jpg",
    }));
  } catch (err) {
    console.error(`Error searching for ${query}:`, err);
    return [];
  }
};
