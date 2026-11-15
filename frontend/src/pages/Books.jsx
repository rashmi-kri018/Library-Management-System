import { useState, useEffect } from 'react'

function Books() {
  const [bookTitle, setBookTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isbn, setIsbn] = useState('')
 const [books, setBooks] = useState([])

useEffect(() => {
  fetch('http://localhost:8080/api/books')
    .then((response) => response.json())
    .then((data) => setBooks(data))
    .catch((error) => {
      console.error('Error fetching books:', error)
      alert('Unable to load books from the server!')
    })
}, [])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingBookId, setEditingBookId] = useState(null)
  const handleAddBook = () => {
  if (!bookTitle || !author || !isbn) {
    alert('Please fill in all the fields!')
    return
  }

  const duplicateBook = books.find(
  (book) => book.isbn === isbn
)

if (duplicateBook) {
  alert('A book with this ISBN already exists!')
  return
}

const newBook = {
  title: bookTitle,
  author: author,
  isbn: isbn,
  status: 'Available'
}

fetch('http://localhost:8080/api/books', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newBook)
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to add book')
    }
    return response.json()
  })
  .then((savedBook) => {
    setBooks((previousBooks) => [...previousBooks, savedBook])
    setBookTitle('')
    setAuthor('')
    setIsbn('')
  })
  .catch((error) => {
    console.error('Error adding book:', error)
    alert('Unable to add book!')
  })

return

  setBookTitle('')
  setAuthor('')
  setIsbn('')
}

const handleDeleteBook = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/books/${id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete book')
    }

    setBooks((previousBooks) =>
      previousBooks.filter((book) => book.id !== id)
    )
  } catch (error) {
    console.error('Error deleting book:', error)
    alert('Unable to delete book!')
  }
}

const handleIssueReturn = (id) => {
  const updatedBooks = books.map((book) =>
    book.id === id
      ? {
          ...book,
          status: book.status === 'Available' ? 'Issued' : 'Available'
        }
      : book
  )

  setBooks(updatedBooks)
}

const handleEditBook = (book) => {
  setEditingBookId(book.id)
  setBookTitle(book.title)
  setAuthor(book.author)
  setIsbn(book.isbn)
}

const handleUpdateBook = async () => {
  if (!bookTitle || !author || !isbn) {
    alert('Please fill in all the fields!')
    return
  }

  const duplicateBook = books.find(
    (book) => book.isbn === isbn && book.id !== editingBookId
  )

  if (duplicateBook) {
    alert('This ISBN already belongs to another book!')
    return
  }

  const updatedBook = {
    title: bookTitle,
    author: author,
    isbn: isbn,
    status: books.find((book) => book.id === editingBookId)?.status || 'Available'
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/books/${editingBookId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBook)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update book')
    }

    const savedBook = await response.json()

    setBooks((previousBooks) =>
      previousBooks.map((book) =>
        book.id === editingBookId ? savedBook : book
      )
    )

    setEditingBookId(null)
    setBookTitle('')
    setAuthor('')
    setIsbn('')

    alert('Book updated successfully!')
  } catch (error) {
    console.error('Error updating book:', error)
    alert('Unable to update book!')
  }
}

const handleCancelEdit = () => {
  setEditingBookId(null)
  setBookTitle('')
  setAuthor('')
  setIsbn('')
}


const filteredBooks = books.filter((book) =>
  book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
  book.isbn.includes(searchTerm)
)

  return (
    <div className="dashboard">
      <h1>Books Management</h1>
      <p>Manage all the books available in your library.</p>

      <div className="book-form">
        <h2>Add New Book</h2>

        <input
          type="text"
          placeholder="Enter Book Title"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />

        <button onClick={editingBookId ? handleUpdateBook : handleAddBook}>
            {editingBookId ? 'Update Book' : 'Add Book'}
          </button>
          {editingBookId && (
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
        )}
      </div>
      <div className="books-list">
  <h2>All Books</h2>
  <input
  type="text"
  placeholder="Search by title, author or ISBN..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

  <table>
    <thead>
      <tr>
        <th>Book Title</th>
        <th>Author</th>
        <th>ISBN</th>
        <th>Availability</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredBooks.map((book) => (
        <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.isbn}</td>
            <td>
                <span className={`availability-status ${book.status?.toLowerCase()}`}>
                {book.status || 'Available'}
                </span>
            </td>
            <td>
            <button onClick={() => handleIssueReturn(book.id)}>
                {book.status === 'Available' ? 'Issue' : 'Return'}
            </button>

            <button onClick={() => handleDeleteBook(book.id)}>
                Delete
            </button>

            <button onClick={() => handleEditBook(book)}>
              Edit
            </button>
            </td>
            </tr>
        ))}
      </tbody>
    </table>
  </div>
 </div>
  )
}

export default Books