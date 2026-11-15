
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Members from './pages/Members'
import CheckInOut from './pages/CheckInOut'
import IssueReturn from './pages/IssueReturn'
import VisitHistory from './pages/VisitHistory'
import Analytics from './pages/Analytics'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  const [activePage, setActivePage] = useState('Dashboard')

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    )

    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="app">
      <header className="navbar">
        <h2>Library Management System</h2>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <div className="main-layout">
        <Sidebar
          activePage={activePage}
          onPageChange={setActivePage}
        />

<main>
  {activePage === 'Dashboard' ? (
    <Dashboard />
  ) : activePage === 'Books' ? (
    <Books />
  ) : activePage === 'Members' ? (
    <Members />
  ) : activePage === 'Check In / Out' ? (
    <CheckInOut />
  ) : activePage === 'Visit History' ? (
    <VisitHistory /> 
  ) : activePage === 'Issue & Return' ? (
    <IssueReturn />
  ) : activePage === 'Analytics' ? (
    <Analytics />
  ) : (
    <div className="dashboard">
      <h1>{activePage}</h1>
      <p>
        Welcome to the {activePage} section of your library management
        system.
      </p>
    </div>
  )}
</main>
      </div>
    </div>
  )
}

export default App