import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Book } from "../../../shared/types";

const filePath = resolve("src/data/books.json");

export function readBooks(): Book[] {
  const data = readFileSync(filePath, "utf-8");

  return JSON.parse(data);
}

export function writeToBooks(listOfBooks: Book[]): void {
  writeFileSync(filePath, JSON.stringify(listOfBooks), "utf-8");
}