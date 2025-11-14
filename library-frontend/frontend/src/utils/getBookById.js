import booksData from "../data/booksData.json";

export const getBookById = (id) => {
  if (!id) return null;

  const cleanId = id.replace("/works/", "").trim();

  // Search static JSON
  for (const category in booksData) {
    const found = booksData[category].find(
      (b) => b.id.replace("/works/", "") === cleanId
    );
    if (found) return found;
  }

  return null; // search API books handled in BookDetails
};
