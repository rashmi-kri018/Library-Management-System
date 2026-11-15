
import { useState, useEffect } from 'react'
import API_URL from '../api'

function getLocalDate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function IssueReturn() {
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [records, setRecords] = useState([])

  const [selectedBook, setSelectedBook] = useState('')
  const [selectedMember, setSelectedMember] = useState('')
  const [issueDate, setIssueDate] = useState(getLocalDate())

  const defaultDueDate = new Date()
  defaultDueDate.setDate(defaultDueDate.getDate() + 14)

  const [dueDate, setDueDate] = useState(
    getLocalDate(defaultDueDate)
  )

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [booksResponse, membersResponse, recordsResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/books`),
          fetch(`${API_URL}/api/members`),
          fetch(`${API_URL}/api/borrow-records`)
        ])

      if (!booksResponse.ok || !membersResponse.ok || !recordsResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const booksData = await booksResponse.json()
      const membersData = await membersResponse.json()
      const recordsData = await recordsResponse.json()

      setBooks(booksData)
      setMembers(membersData)
      setRecords(recordsData)

    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Unable to load library data!')
    }
  }

  fetchData()
}, [])

  const availableBooks = books.filter(
    (book) => book.status !== 'Issued'
  )

const handleIssueBook = async () => {
  if (!selectedBook || !selectedMember || !issueDate || !dueDate) {
    alert('Please fill in all the details!')
    return
  }

  if (dueDate < issueDate) {
    alert('Due date cannot be before issue date!')
    return
  }

  const book = books.find(
    (item) => String(item.id) === selectedBook
  )

  const member = members.find(
    (item) => String(item.id) === selectedMember
  )

  if (!book || !member || book.status === 'Issued') {
    alert('Book or member is unavailable!')
    return
  }

  const newRecord = {
    bookId: book.id,
    bookTitle: book.title,
    isbn: book.isbn,
    memberId: member.memberId,
    memberName: member.memberName,
    issueDate,
    dueDate,
    returnDate: null
  }

  try {
    const response = await fetch(`${API_URL}/api/borrow-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRecord)
    })

    if (!response.ok) {
      throw new Error('Failed to issue book')
    }

    const savedRecord = await response.json()

    setRecords((previous) => [...previous, savedRecord])

    setBooks((previous) =>
      previous.map((item) =>
        item.id === book.id
          ? { ...item, status: 'Issued' }
          : item
      )
    )

    setSelectedBook('')
    setSelectedMember('')

    alert('Book issued successfully!')

  } catch (error) {
    console.error('Error issuing book:', error)
    alert('Unable to issue book. Please try again.')
  }
}


  
const handleReturnBook = async (recordId) => {
  const record = records.find(
    (item) => item.id === recordId
  )

  if (!record || record.returnDate) return

  try {
    const response = await fetch(
      `${API_URL}/api/borrow-records/${recordId}/return`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          returnDate: getLocalDate()
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to return book')
    }

    const updatedRecord = await response.json()

    setRecords((previous) =>
      previous.map((item) =>
        item.id === recordId ? updatedRecord : item
      )
    )

    setBooks((previous) =>
      previous.map((book) =>
        book.id === record.bookId
          ? { ...book, status: 'Available' }
          : book
      )
    )

    alert('Book returned successfully!')

  } catch (error) {
    console.error('Error returning book:', error)
    alert('Unable to return book. Please try again.')
  }
}


  const activeRecords = records.filter(
    (record) => !record.returnDate
  )

  const overdueRecords = activeRecords.filter(
    (record) => record.dueDate < getLocalDate()
  )

  const filteredRecords = records.filter((record) =>
    record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="dashboard">
      <h1>Issue & Return</h1>
      <p>Manage book borrowing and returning records.</p>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Available Books</h3>
          <h2>{availableBooks.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Books Issued</h3>
          <h2>{activeRecords.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Overdue Books</h3>
          <h2>{overdueRecords.length}</h2>
        </div>
      </div>

      <div className="book-form">
        <h2>Issue a Book</h2>

        <label>Select Member</label>
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          <option value="">Choose a member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.memberName} ({member.memberId})
            </option>
          ))}
        </select>

        <label>Select Book</label>
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
        >
          <option value="">Choose a book</option>
          {availableBooks.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} - {book.author}
            </option>
          ))}
        </select>

        <label>Issue Date</label>
        <input
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
        />

        <label>Due Date</label>
        <input
          type="date"
          min={issueDate}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button type="button" onClick={handleIssueBook}>
          Issue Book
        </button>
      </div>

      <div className="books-list">
        <h2>Borrowing History</h2>

        <input
          type="text"
          placeholder="Search by book or member..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                const isOverdue =
                  !record.returnDate &&
                  record.dueDate < getLocalDate()

                return (
                  <tr key={record.id}>
                    <td>{record.bookTitle}</td>
                    <td>
                      {record.memberName} ({record.memberId})
                    </td>
                    <td>{record.issueDate}</td>
                    <td>{record.dueDate}</td>
                    <td>{record.returnDate || 'Not returned'}</td>
                    <td>
                      {record.returnDate
                        ? 'Returned'
                        : isOverdue
                          ? 'Overdue'
                          : 'Issued'}
                    </td>
                    <td>
                      {!record.returnDate && (
                        <button
                          type="button"
                          onClick={() => handleReturnBook(record.id)}
                        >
                          Return Book
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="7">No borrowing records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default IssueReturn
