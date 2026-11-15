
import { useState, useEffect } from 'react'

function CheckInOut() {
  const [memberId, setMemberId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

 const [visits, setVisits] = useState([])

 useEffect(() => {
  fetch('http://localhost:8080/api/visits')
    .then((response) => response.json())
    .then((data) => setVisits(data))
    .catch((error) => {
      console.error('Error fetching visits:', error)
      alert('Unable to load visit records from the server!')
    })
}, [])

  // Automatically save visit records
 // Get currently active visits
  const currentVisitors = visits.filter(
    (visit) => !visit.checkOutTime
  )

  // Check In a registered member
  const handleCheckIn = async () => {
  if (!memberId.trim()) {
    alert('Please enter a Member ID!')
    return
  }

  try {
    // Fetch registered members from backend
    const memberResponse = await fetch(
      'http://localhost:8080/api/members'
    )

    if (!memberResponse.ok) {
      throw new Error('Failed to fetch members')
    }

    const savedMembers = await memberResponse.json()

    const member = savedMembers.find(
      (item) =>
        item.memberId.toLowerCase() === memberId.trim().toLowerCase()
    )

    if (!member) {
      alert('Member not found! Please register first.')
      return
    }

    const alreadyInside = visits.find(
      (visit) =>
        visit.memberId === member.memberId &&
        !visit.checkOutTime
    )

    if (alreadyInside) {
      alert('This member is already inside the library!')
      return
    }

    const newVisit = {
      memberId: member.memberId,
      memberName: member.memberName,
      memberType: member.memberType,
      checkInTime: new Date().toISOString(),
      checkOutTime: null
    }

    const response = await fetch(
      'http://localhost:8080/api/visits',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVisit)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to check in member')
    }

    const savedVisit = await response.json()

    setVisits((previousVisits) => [
      ...previousVisits,
      savedVisit
    ])

    setMemberId('')
    alert(`${member.memberName} checked in successfully!`)

  } catch (error) {
    console.error('Error checking in member:', error)
    alert('Unable to check in member!')
  }
}

  // Check Out a member
  const handleCheckOut = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/visits/${id}/checkout`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkOutTime: new Date().toISOString()
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to check out member')
    }

    const updatedVisit = await response.json()

    setVisits((previousVisits) =>
      previousVisits.map((visit) =>
        visit.id === id ? updatedVisit : visit
      )
    )

    alert('Member checked out successfully!')

  } catch (error) {
    console.error('Error checking out member:', error)
    alert('Unable to check out member!')
  }
}

  // Search visit history
  const filteredVisits = visits.filter((visit) =>
    visit.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="dashboard">

      <h1>Library Check In / Check Out</h1>
      <p>Track members entering and leaving the library.</p>

      {/* Visitor Statistics */}
      <div className="stats-container">

        <div className="stat-card">
          <h3>Current Visitors</h3>
          <h2>{currentVisitors.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Visits</h3>
          <h2>{visits.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Completed Visits</h3>
          <h2>
            {visits.filter((visit) => visit.checkOutTime).length}
          </h2>
        </div>

      </div>

      {/* Check In Form */}
      <div className="book-form">
        <h2>Member Check In</h2>

        <input
          type="text"
          placeholder="Enter Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        />

        <button onClick={handleCheckIn}>
          Check In
        </button>
      </div>

      {/* Current Visitors */}
      <div className="books-list">

        <h2>Members Currently Inside</h2>

        <table>
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Member ID</th>
              <th>Member Type</th>
              <th>Check In Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentVisitors.length > 0 ? (
              currentVisitors.map((visit) => (
                <tr key={visit.id}>
                  <td>{visit.memberName}</td>
                  <td>{visit.memberId}</td>
                  <td>{visit.memberType}</td>
                  <td>
                    {new Date(visit.checkInTime).toLocaleString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleCheckOut(visit.id)}
                    >
                      Check Out
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  No visitors currently inside.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* Visit History */}
      <div className="books-list">

        <h2>Visit History</h2>

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
                <td colSpan="6">No visit records found.</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

    </div>
  )
}

export default CheckInOut
