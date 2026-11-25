import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import type { Book } from "../../../shared/types";
import { getBook } from "../api/books";


export function BookPage() {
  const { id } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const controller = new AbortController();

    async function loadBook() {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("ID книги отсутствует");
        }

        const data = await getBook(id, controller.signal);

        setBook(data);
      } catch {
        if (!controller.signal.aborted) {
          setError("Не удалось загрузить книгу");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <p>Загрузка книги...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!book) {
    return <p>Книга не найдена</p>;
  }

  return (
    <div>
      <Link to="/books" className="btn btn-outline-secondary mb-3">
        Вернуться к списку книг
      </Link>
      <h1>{book.title}</h1>
      <p>Автор: {book.author}</p>
      <p>Жанр: {book.genre}</p>
      <p>Статус: {book.status}</p>
      <p>Оценка: {book.rating}</p>
      <p>Заметка: {book.note}</p>
    </div>
  );
} 