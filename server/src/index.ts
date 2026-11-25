import express from "express";

import booksRoutes from "./routes/booksRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/books", booksRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "MyLibrary API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});