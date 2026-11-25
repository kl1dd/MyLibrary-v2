import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import type { Book, CreateBookData, UpdateBookData } from "../../shared/types";
import { useState, useEffect } from "react";
import { getBooks, createBook, updateBook as updateBookApi, deleteBook as deleteBookApi } from "./api/books";
import { Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from "react-router";
import { BookPage } from "./pages/BookPage";

export function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const statusFilter = params.get("status") ?? "all";
  const genreFilter = params.get("genre") ?? "all";

  function updateParam(name: string, value: string) {
    setParams((current) => {
      const next = new URLSearchParams(current);

      if (value === "" || value === "all") {
        next.delete(name);
      } else {
        next.set(name, value);
      }

      return next;
    }, { replace: true });
  }

  const apiParams = new URLSearchParams();
  if (search.trim()) {
    apiParams.set("search", search.trim());
  }
  if (statusFilter !== "all") {
    apiParams.set("status", statusFilter);
  }
  if (genreFilter !== "all") {
    apiParams.set("genre", genreFilter);
  }
  if (location.pathname === "/rated") {
    apiParams.set("rated", "true");
  }
  const query = apiParams.toString();


  const [bookList, setBookList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [allBooksLoading, setAllBooksLoading] = useState(true);
  const [allBooksError, setAllBooksError] = useState<string | null>(null);

  useEffect(() => {  
    const controller = new AbortController();

    async function loadBooks() {
      try {
        setAllBooksLoading(true);
        setAllBooksError(null);

        const books = await getBooks("", controller.signal);

        if (!controller.signal.aborted) {
          setBookList(books);
        }
      } catch {
        if (!controller.signal.aborted) {
          setAllBooksError("Не удалось загрузить книги");
        }
      } finally {
        if (!controller.signal.aborted) {
          setAllBooksLoading(false);
        }
      }
    }

    loadBooks();

    return () => controller.abort();
  }, []);

  
  const genres = [...new Set(
      bookList.map((book) => book.genre.trim())
      )].filter((genre) => genre !== "");


  async function addBook(data: CreateBookData) {
    setActionError(null);

    try {
      const newBook = await createBook(data);
      setBookList((prev) => [...prev, newBook]);

      navigate(`/books/${newBook.id}`);
    } catch {
      setActionError("Не удалось добавить книгу");
      throw new Error("Failed to create book");
    }
  }

  async function deleteBook(id: string) {
    setActionError(null);

    try {
      await deleteBookApi(id);

      setBookList((prev) =>
        prev.filter((book) => book.id !== id)
      );

      navigate("/books");
    } catch {
      setActionError("Не удалось удалить книгу");
    }
  }

  async function updateBook(id: string, data: UpdateBookData) {
    setActionError(null);

    try {
      const updatedBook = await updateBookApi(id, data);

      setBookList((prev) =>
        prev.map((book) => {
          if (book.id === id) {
            return updatedBook;
          }

          return book;
        })
      );

      navigate(`/books/${id}`);
    } catch {
      setActionError("Не удалось обновить книгу");
      throw new Error("Failed to update book");
    }
  }


  const [visibleBooks, setVisibleBooks] = useState<Book[]>([]);
  useEffect(() => {
    const controller = new AbortController();

    async function loadVisibleBooks() {
      try {
        setLoading(true);
        setError(null);

        const books = await getBooks(query, controller.signal);

        setVisibleBooks(books);
      } catch {
        if (!controller.signal.aborted) {
          setError("Не удалось загрузить книги");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadVisibleBooks();

    return () => controller.abort();
  }, [query, bookList]);

  const dashboard = (
    <>
      <input
        type="search"
        className="form-control mb-4"
        placeholder="Поиск по названию или автору..."
        value={search}
        onChange={(event) => updateParam("search", event.target.value)}
      />

      <select
        className="form-select mb-4"
        value={statusFilter}
        onChange={(event) => updateParam("status", event.target.value)}
      >
        <option value="all">Все статусы</option>
        <option value="planned">В планах</option>
        <option value="reading">Читаю</option>
        <option value="finished">Прочитано</option>
      </select>

      <select
        className="form-select mb-4"
        value={genreFilter}
        onChange={(event) => updateParam("genre", event.target.value)}
      >
        <option value="all">Все жанры</option>

        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      

      {(loading || allBooksLoading) && (
        <p>Загрузка книг...</p>
      )}
      {(error || allBooksError) && (
        <div className="alert alert-danger">
          {error || allBooksError}
        </div>
      )}

      {actionError && (
        <div className="alert alert-danger">
          {actionError}
        </div>
      )}

      {!allBooksLoading && !allBooksError && (
        <DashboardPage
          books={visibleBooks}
          allBooks={bookList}
          onAddBook={addBook}
          onDeleteBook={deleteBook}
          onUpdateBook={updateBook}
        />
      )}
    </>
  );

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/books" replace />} />

        <Route path="books" element={dashboard} />

        <Route path="rated" element={dashboard} />

        <Route path="books/:id" element={<BookPage />} />

        <Route
          path="*"
          element={<h1>Страница не найдена</h1>}
        />
      </Route>
    </Routes>
  );
}
