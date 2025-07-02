
import { useEffect,useState } from 'react'
function Header({toggleSidebar}) {
  
  return (
        <div className="header">
          <div className="header-left">
            <div className="hamburger" onClick={toggleSidebar}>
              <i class="fa-solid fa-bars"></i>
            </div>
            <h1>Inventory manager</h1>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <i className="fas fa-user-circle"></i>
              <span>Admin</span>
            </div>
          </div>
        </div>
  )
}

export default Header