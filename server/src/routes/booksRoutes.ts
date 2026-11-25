import { Router } from "express";
import { readBooks, writeToBooks } from "../data/booksStorage";
import { randomUUID } from "node:crypto";
import type { Book } from "../../../shared/types";

export function validateBook(data: unknown): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Invalid book data";
  }


  const { title, author, genre, status, rating, note } = data as Record<string, unknown>;
  if (typeof title !== "string" || !title.trim()) {
    return "Title is required";
  }

  if (typeof author !== "string" || !author.trim()) {
    return "Author is required";
  }

  if (genre !== undefined && typeof genre !== "string") {
    return "Invalid genre";
  }

  if (
    status !== undefined &&
    status !== "planned" &&
    status !== "reading" &&
    status !== "finished"
  ) {
    return "Invalid reading status";
  }

  if (rating !== undefined && rating !== null) {
    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return "Rating must be between 1 and 5";
    }
  }

  if (note !== undefined && typeof note !== "string") {
    return "Invalid note";
  }

  return null;
}



const router = Router();

router.get("/", (req, res) => {
  let books = readBooks();

  const { search, status, rated } = req.query;

  if (typeof search === "string" && search.trim()) {
    const value = search.trim().toLowerCase();
    books = books.filter((book) =>
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value)
    );
  }
  
  if (typeof status === "string" && status !== "all") {
    books = books.filter((book) => book.status === status);
  }

  if (rated === "true") {
    books = books.filter((book) => book.rating !== null);
  }

  res.status(200).json(books);
});

router.get("/:id", (req, res) => {
  const books = readBooks();
  const book = books.find((item) => item.id === req.params.id);

  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  res.status(200).json(book);
});


router.post("/", (req, res) => {
  const error = validateBook(req.body);
  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  
  const { title, author, genre, status, rating, note } = req.body;
  const newBook: Book = {
    id: randomUUID(),
    title: title.trim(),
    author: author.trim(),
    genre: genre ?? "",
    status: status ?? "planned",
    rating: rating ?? null,
    note: note ?? "",
  };

  const books = readBooks();
  books.push(newBook);
  writeToBooks(books);
  res.status(201).json(newBook);
});


router.patch("/:id", (req, res) => {
  const books = readBooks();
  const index = books.findIndex(
    (item) => item.id === req.params.id
  );

  if (index === -1) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({ message: "Invalid book data" });
    return;
  }

  const updatedBook: Book = {
    ...books[index],
    ...req.body,
    id: books[index].id,
  };


  const error = validateBook(updatedBook);
  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  const allowedFields = [
    "title",
    "author",
    "genre",
    "status",
    "rating",
    "note",
  ];
  const hasInvalidFields = Object.keys(req.body).some(
    (key) => !allowedFields.includes(key)
  );
  if (hasInvalidFields) {
    res.status(400).json({ message: "Unknown book fields" });
    return;
  }

  
  books[index] = updatedBook;
  writeToBooks(books);
  res.status(200).json(updatedBook);
});


router.delete("/:id", (req, res) => {
  const books = readBooks();
  const index = books.findIndex(
    (item) => item.id === req.params.id
  );

  if (index === -1) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  books.splice(index, 1);
  writeToBooks(books);
  res.status(204).end();
});

export default router;