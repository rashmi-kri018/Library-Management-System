
import { useState, useEffect } from 'react'
import API_URL from '../api'

function VisitHistory() {
  const [visits, setVisits] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

 useEffect(() => {
  fetch(`${API_URL}/api/visits`)
    .then((response) => response.json())
    .then((data) => setVisits(data))
    .catch((error) => {
      console.error('Error fetching visit history:', error)
      alert('Unable to load visit history!')
    })
}, [])

  const filteredVisits = visits.filter((visit) =>
    visit.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const completedVisits = visits.filter(
    (visit) => visit.checkOutTime
  ).length

  const currentVisitors = visits.filter(
    (visit) => !visit.checkOutTime
  ).length

  return (
    <div className="dashboard">
      <h1>Visit History</h1>
      <p>View and track all library visitor records.</p>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Visits</h3>
          <h2>{visits.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Completed Visits</h3>
          <h2>{completedVisits}</h2>
        </div>

        <div className="stat-card">
          <h3>Currently Inside</h3>
          <h2>{currentVisitors}</h2>
        </div>
      </div>

      <div className="books-list">
        <h2>All Visitor Records</h2>

        <input
          type="text"
          placeholder="Search by member name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>Visit ID</th>
              <th>Member Name</th>
              <th>Member ID</th>
              <th>Member Type</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredVisits.length > 0 ? (
              filteredVisits.map((visit) => (
                <tr key={visit.id}>
                  <td>{visit.id}</td>
                  <td>{visit.memberName}</td>
                  <td>{visit.memberId}</td>
                  <td>{visit.memberType}</td>
                  <td>
                    {new Date(visit.checkInTime).toLocaleString()}
                  </td>
                  <td>
                    {visit.checkOutTime
                      ? new Date(visit.checkOutTime).toLocaleString()
                      : 'Not checked out'}
                  </td>
                  <td>
                    {visit.checkOutTime ? 'Outside' : 'Inside'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No visit records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VisitHistory
