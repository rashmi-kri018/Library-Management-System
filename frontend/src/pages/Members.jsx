import { useState, useEffect } from 'react'

function Members() {
    const [memberName, setMemberName] = useState('')
    const [memberId, setMemberId] = useState('')
    const [memberType, setMemberType] = useState('Student')
    const [searchTerm, setSearchTerm] = useState('')
    const [editingMemberId, setEditingMemberId] = useState(null)
    const [members, setMembers] = useState([])

    useEffect(() => {
      fetch('http://localhost:8080/api/members')
      .then((response) => response.json())
      .then((data) => setMembers(data))
      .catch((error) => {
        console.error('Error fetching members:', error)
        alert('Unable to load members from the server!')
      })
  }, [])

  const handleAddMember = async () => {
  if (!memberName || !memberId) {
    alert('Please fill in all the fields!')
    return
  }

  const duplicateMember = members.find(
    (member) => member.memberId === memberId
  )

  if (duplicateMember) {
    alert('This Member ID already exists!')
    return
  }

  const newMember = {
    memberName,
    memberId,
    memberType
  }

  try {
    const response = await fetch('http://localhost:8080/api/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMember)
    })

    if (!response.ok) {
      throw new Error('Failed to register member')
    }

    const savedMember = await response.json()

    setMembers((previousMembers) => [...previousMembers, savedMember])

    setMemberName('')
    setMemberId('')
    setMemberType('Student')

  } catch (error) {
    console.error('Error registering member:', error)
    alert('Unable to register member!')
  }
}

const handleDeleteMember = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/members/${id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete member')
    }

    setMembers((previousMembers) =>
      previousMembers.filter((member) => member.id !== id)
    )

  } catch (error) {
    console.error('Error deleting member:', error)
    alert('Unable to delete member!')
  }
}

const handleEditMember = (member) => {
  setEditingMemberId(member.id)
  setMemberName(member.memberName)
  setMemberId(member.memberId)
  setMemberType(member.memberType)
}

const handleUpdateMember = async () => {
  if (!memberName || !memberId) {
    alert('Please fill in all the fields!')
    return
  }

  const duplicateMember = members.find(
    (member) =>
      member.memberId === memberId &&
      member.id !== editingMemberId
  )

  if (duplicateMember) {
    alert('This Member ID already belongs to another member!')
    return
  }

  const updatedMember = {
    memberName,
    memberId,
    memberType
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/members/${editingMemberId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMember)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update member')
    }

    const savedMember = await response.json()

    setMembers((previousMembers) =>
      previousMembers.map((member) =>
        member.id === editingMemberId ? savedMember : member
      )
    )

    setEditingMemberId(null)
    setMemberName('')
    setMemberId('')
    setMemberType('Student')

    alert('Member updated successfully!')

  } catch (error) {
    console.error('Error updating member:', error)
    alert('Unable to update member!')
  }
}

const handleCancelEdit = () => {
  setEditingMemberId(null)
  setMemberName('')
  setMemberId('')
  setMemberType('Student')
}

const filteredMembers = members.filter((member) =>
  member.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  member.memberType.toLowerCase().includes(searchTerm.toLowerCase())
)

  return (
  <div className="dashboard">
    <h1>Members Management</h1>
    <p>Manage students and staff registered in your library.</p>

    <div className="book-form">
      <h2>Register New Member</h2>

      <input
        type="text"
        placeholder="Enter Member Name"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Unique Member ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
      />

      <select
        value={memberType}
        onChange={(e) => setMemberType(e.target.value)}
      >
        <option value="Student">Student</option>
        <option value="Staff">Staff</option>
      </select>

      <button onClick={editingMemberId ? handleUpdateMember : handleAddMember}>
        {editingMemberId ? 'Update Member' : 'Register Member'}
      </button>
      {editingMemberId && (
        <button type="button" onClick={handleCancelEdit}>
          Cancel
        </button>
      )}
    </div>
    <div className="books-list">
  <h2>Registered Members</h2>
  <input
  type="text"
  placeholder="Search by name, ID or type..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
  <table>
    <thead>
      <tr>
        <th>Member Name</th>
        <th>Member ID</th>
        <th>Member Type</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredMembers.map((member) => (
        <tr key={member.id}>
          <td>{member.memberName}</td>
          <td>{member.memberId}</td>
          <td>{member.memberType}</td>
          <td>
            <button onClick={() => handleDeleteMember(member.id)}>
              Delete
            </button>
            <button onClick={() => handleEditMember(member)}>
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

export default Members