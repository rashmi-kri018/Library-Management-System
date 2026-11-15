
function Sidebar({ activePage, onPageChange }) {
  const menuItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Books', icon: '📚' },
    { name: 'Members', icon: '👥' },
    { name: 'Check In / Out', icon: '🚪' },
    { name: 'Visit History', icon: '📋' },
    { name: 'Issue & Return', icon: '📖' },
    { name: 'Analytics', icon: '📊' },
  ]

  return (
    <aside className="sidebar">
      <h3>LIBRARY MENU</h3>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`sidebar-link ${
              activePage === item.name ? 'active' : ''
            }`}
            onClick={() => onPageChange(item.name)}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
