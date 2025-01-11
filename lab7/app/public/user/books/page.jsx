"use client";
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/app/lib/firebase";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    authorName: "",
    authorSurname: "",
  });

  const auth = getAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = auth.currentUser;

        if (!user) {
          throw new Error("User not authenticated");
        }

        const userRef = doc(db, "users", user.uid);

        const booksCollection = collection(db, "books");
        const booksQuery = query(booksCollection, where("user", "==", userRef));
        const querySnapshot = await getDocs(booksQuery);

        if (querySnapshot.empty) {
          console.log("No books found for user:", userRef.path);
          setBooks([]);
        } else {
          const booksList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBooks(booksList);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Could not load books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchBooks();
      } else {
        setBooks([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userRef = doc(db, "users", user.uid);
      const booksCollection = collection(db, "books");

      const newBookData = {
        ...newBook,
        user: userRef,
      };

      const docRef = await addDoc(booksCollection, newBookData);
      console.log("Book added with ID:", docRef.id);

      setBooks((prev) => [...prev, { id: docRef.id, ...newBookData }]);
      setNewBook({
        title: "",
        authorName: "",
        authorSurname: "",
      });
    } catch (err) {
      console.error("Error adding book:", err);
      setError("Could not add the book. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Books</h1>
      {books.length === 0 ? (
        <p>No books found for this user.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <h2>{book.title}</h2>
              <p>
                Author: {book.authorName} {book.authorSurname}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h2>Add a New Book</h2>
      <form onSubmit={handleAddBook}>
        <div>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Author Name:
            <input
              type="text"
              name="authorName"
              value={newBook.authorName}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Author Surname:
            <input
              type="text"
              name="authorSurname"
              value={newBook.authorSurname}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
       
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}
