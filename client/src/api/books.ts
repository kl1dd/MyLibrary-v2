import type { Book, CreateBookData, UpdateBookData } from "../../../shared/types";

const API_URL = "/api/books";


export async function getBooks(query: string = "", signal?: AbortSignal): Promise<Book[]> {
  const response = await fetch(`${API_URL}?${query}`, {signal});
  if (!response.ok) {
    throw new Error("Failed to load books");
  }

  return await response.json();
}

export async function getBook(id: string, signal?: AbortSignal): Promise<Book> {
  const response = await fetch(`${API_URL}/${id}`, {signal});
  if (!response.ok) {
    throw new Error("Failed to load book");
  }

  return await response.json();
}

export async function createBook(data: CreateBookData): Promise<Book> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create book");
  }

  return await response.json();
}

export async function updateBook(id: string, data: UpdateBookData): Promise<Book> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update book");
  }

  return await response.json();
}

export async function deleteBook(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete book");
  }
}