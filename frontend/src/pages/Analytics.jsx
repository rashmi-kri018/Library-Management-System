
import { useState, useEffect } from 'react'

function Analytics() {
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [visits, setVisits] = useState([])
  const [records, setRecords] = useState([])

 
useEffect(() => {
  const fetchAnalyticsData = async () => {
    try {
      const [booksResponse, membersResponse, visitsResponse, recordsResponse] =
        await Promise.all([
          fetch('http://localhost:8080/api/books'),
          fetch('http://localhost:8080/api/members'),
          fetch('http://localhost:8080/api/visits'),
          fetch('http://localhost:8080/api/borrow-records')
        ])

      if (
        !booksResponse.ok ||
        !membersResponse.ok ||
        !visitsResponse.ok ||
        !recordsResponse.ok
      ) {
        throw new Error('Failed to fetch analytics data')
      }

      const booksData = await booksResponse.json()
      const membersData = await membersResponse.json()
      const visitsData = await visitsResponse.json()
      const recordsData = await recordsResponse.json()

      setBooks(booksData)
      setMembers(membersData)
      setVisits(visitsData)
      setRecords(recordsData)

    } catch (error) {
      console.error('Error fetching analytics data:', error)
      alert('Unable to load analytics data!')
    }
  }

  fetchAnalyticsData()
}, [])


  const today = new Date()
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  const issuedBooks = records.filter(
    (record) => !record.returnDate
  )

  const overdueBooks = issuedBooks.filter(
    (record) => record.dueDate < todayString
  )

  const availableBooks = books.filter(
    (book) => book.status !== 'Issued'
  )

  const currentVisitors = visits.filter(
    (visit) => !visit.checkOutTime
  )

  // Monthly borrowing statistics for the last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - (5 - index),
      1
    )

    const year = date.getFullYear()
    const month = date.getMonth()

    const count = records.filter((record) => {
      const issueDate = new Date(record.issueDate + 'T00:00:00')
      return (
        issueDate.getFullYear() === year &&
        issueDate.getMonth() === month
      )
    }).length

    return {
      month: date.toLocaleString('en-IN', { month: 'short' }),
      count
    }
  })

  const maxMonthlyCount = Math.max(
    ...monthlyData.map((item) => item.count),
    1
  )

  // Most borrowed books
  const bookCounts = {}

  records.forEach((record) => {
    bookCounts[record.bookTitle] =
      (bookCounts[record.bookTitle] || 0) + 1
  })

  const popularBooks = Object.entries(bookCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const maxBookCount = Math.max(
    ...popularBooks.map((book) => book.count),
    1
  )

  // Visitor activity for the last 7 days
  const visitorData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))

    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-')

    const count = visits.filter(
      (visit) => visit.checkInTime.startsWith(dateString)
    ).length

    return {
      day: date.toLocaleString('en-IN', { weekday: 'short' }),
      count
    }
  })

  const maxVisitorCount = Math.max(
    ...visitorData.map((item) => item.count),
    1
  )

  return (
    <div className="dashboard">
      <h1>Analytics & Reports</h1>
      <p>Understand your library's performance and activity.</p>

      <h2 className="section-title">Library Overview</h2>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Books</h3>
          <h2>{books.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Available Books</h3>
          <h2>{availableBooks.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Members</h3>
          <h2>{members.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Books Issued</h3>
          <h2>{issuedBooks.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Overdue Books</h3>
          <h2>{overdueBooks.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Visitors Inside</h3>
          <h2>{currentVisitors.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Visits</h3>
          <h2>{visits.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Borrowings</h3>
          <h2>{records.length}</h2>
        </div>
      </div>

      <div className="books-list">
        <h2>Monthly Book Borrowing</h2>
        <p>Books borrowed during the last six months.</p>

        {monthlyData.map((item) => (
          <div key={item.month} style={{ marginBottom: '18px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px'
            }}>
              <strong>{item.month}</strong>
              <span>{item.count} books</span>
            </div>

            <div style={{
              background: 'var(--card-border, #ddd)',
              height: '14px',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(item.count / maxMonthlyCount) * 100}%`,
                height: '100%',
                background: '#3b82f6',
                borderRadius: '10px'
              }} />
            </div>
          </div>
        ))}
      </div>

      <div className="books-list">
        <h2>Most Borrowed Books</h2>

        {popularBooks.length > 0 ? (
          popularBooks.map((book) => (
            <div key={book.title} style={{ marginBottom: '18px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}>
                <strong>{book.title}</strong>
                <span>{book.count} times</span>
              </div>

              <div style={{
                background: 'var(--card-border, #ddd)',
                height: '14px',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(book.count / maxBookCount) * 100}%`,
                  height: '100%',
                  background: '#10b981',
                  borderRadius: '10px'
                }} />
              </div>
            </div>
          ))
        ) : (
          <p>No borrowing records available yet.</p>
        )}
      </div>

      <div className="books-list">
        <h2>Weekly Visitor Activity</h2>
        <p>Visitors who checked into the library during the last seven days.</p>

        {visitorData.map((item) => (
          <div key={item.day} style={{ marginBottom: '18px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px'
            }}>
              <strong>{item.day}</strong>
              <span>{item.count} visitors</span>
            </div>

            <div style={{
              background: 'var(--card-border, #ddd)',
              height: '14px',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(item.count / maxVisitorCount) * 100}%`,
                height: '100%',
                background: '#f59e0b',
                borderRadius: '10px'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Analytics
