import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus } from 'react-icons/fa';

axios.defaults.baseURL = 'http://localhost:5000'; // Your Flask backend URL

function BookManagement() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('/books');
            setBooks(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    const addBook = async () => {
        if (!newBook.title || !newBook.author) {
            alert('Both title and author are required!');
            return;
        }

        try {
            await axios.post('/books', newBook);
            setNewBook({ title: '', author: '' });
            fetchBooks();
        } catch (err) {
            setError('Failed to add book');
        }
    };

    const deleteBook = async (id) => {
        try {
            await axios.delete(`/books/${id}`);
            fetchBooks();
        } catch (err) {
            setError('Failed to delete book');
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <div className="bg-blue-500 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white">Book Management</h2>
            {error && <div className="text-red-300 mb-4">{error}</div>}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="border border-gray-300 rounded p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                    onClick={addBook}
                    className="bg-[#7B4B3A] text-white px-4 py-2 rounded hover:bg-[#6A3D31] transition duration-200 w-full flex items-center justify-center"
                >
                    <FaPlus className="mr-2" /> Add Book
                </button>
            </div>

            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-4 text-left">Title</th>
                        <th className="py-2 px-4 text-left">Author</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(books) && books.length > 0 ? (
                        books.map((book) => (
                            <tr key={book.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{book.title}</td>
                                <td className="py-2 px-4 border-b">{book.author}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => deleteBook(book.id)}
                                        className="text-red-500 hover:underline transition duration-200 flex items-center"
                                    >
                                        <FaTrash className="mr-1" /> Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="py-2 px-4 border-b text-center text-gray-500">
                                No books available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default BookManagement;
