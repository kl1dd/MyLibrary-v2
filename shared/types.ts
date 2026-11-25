export type ReadingStatus = "planned" | "reading" | "finished";

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
  rating: number | null;
  note: string;
};

export type CreateBookData = {
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
  rating: number | null;
  note: string;
};

export type UpdateBookData = {
  title?: string;
  author?: string;
  genre?: string;
  status?: ReadingStatus;
  rating?: number | null;
  note?: string;
};