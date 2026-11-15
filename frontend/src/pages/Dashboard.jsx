
import { useState, useEffect } from 'react'

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    totalMembers: 0,
    visitorsInside: 0,
    overdueBooks: 0,
    totalVisits: 0
  })

  const [recentActivities, setRecentActivities] = useState([])
 
useEffect(() => {
  const fetchDashboardData = async () => {
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
        throw new Error('Failed to fetch dashboard data')
      }

      const books = await booksResponse.json()
      const members = await membersResponse.json()
      const visits = await visitsResponse.json()
      const records = await recordsResponse.json()

      const activities = [
        ...records.map((record) => ({
          type: record.returnDate ? 'Book Returned' : 'Book Issued',
          description: `${record.bookTitle} - ${record.memberName}`,
          date: record.returnDate || record.issueDate
        })),
        ...visits.map((visit) => ({
          type: visit.checkOutTime
            ? 'Visitor Checked Out'
            : 'Visitor Checked In',
          description: visit.memberName,
          date: visit.checkOutTime || visit.checkInTime
        }))
      ]

      const sortedActivities = activities
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)

      setRecentActivities(sortedActivities)

      const today = new Date()
      const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
      ].join('-')

      const issuedBooks = books.filter(
        (book) => book.status === 'Issued'
      )

      const currentVisitors = visits.filter(
        (visit) => !visit.checkOutTime
      )

      const overdueBooks = records.filter(
        (record) =>
          !record.returnDate && record.dueDate < todayString
      )

      setStats({
        totalBooks: books.length,
        availableBooks: books.length - issuedBooks.length,
        issuedBooks: issuedBooks.length,
        totalMembers: members.length,
        visitorsInside: currentVisitors.length,
        overdueBooks: overdueBooks.length,
        totalVisits: visits.length
      })

    } catch (error) {
      console.error('Error loading dashboard:', error)
      alert('Unable to load dashboard data!')
    }
  }

  fetchDashboardData()
}, [])


  const statCards = [
    { title: 'Total Books', value: stats.totalBooks, icon: '📚' },
    { title: 'Available Books', value: stats.availableBooks, icon: '📗' },
    { title: 'Books Issued', value: stats.issuedBooks, icon: '📖' },
    { title: 'Registered Members', value: stats.totalMembers, icon: '👥' },
    { title: 'Visitors Inside', value: stats.visitorsInside, icon: '🚪' },
    { title: 'Overdue Books', value: stats.overdueBooks, icon: '⚠️' },
    { title: 'Total Visits', value: stats.totalVisits, icon: '📋' }
  ]

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to your Library Management System.</p>

      <h2 className="section-title">Library Overview</h2>

      <div className="stats-container">
        {statCards.map((card) => (
          <div className="stat-card" key={card.title}>
            <h3>{card.icon} {card.title}</h3>
            <h2>{card.value}</h2>
          </div>
        ))}
      </div>
            
    <div className="recent-activity">
        <h2 className="section-title">Recent Activity</h2>

        {recentActivities.length === 0 ? (
          <p>No recent activities yet.</p>
        ) : (
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div className="activity-item" key={index}>
                <div>
                  <h3>{activity.type}</h3>
                  <p>{activity.description}</p>
                </div>

                <small>
                  {activity.date
                    ? new Date(activity.date).toLocaleString()
                    : 'Date unavailable'}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
