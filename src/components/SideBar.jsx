
import { useEffect,useState } from 'react'
import { NavLink } from 'react-router-dom';

function SideBar({ isOpen, toggleSidebar }) {
  // const [isOpen,setIsOpen] = useState(true)
  const [openSection,setOpenSection] = useState({
    product:true,
    users:false,
    settings:false
  })
   const toggleHumbuger = (section) => {
    setOpenSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  return (
    <div className='container'>
      <div className={`sidebar ${isOpen ? 'closed' : 'open'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span>SmartJ</span>
          </div>
        </div>
        
        <div className="sidebar-content">

          <div className="menu-section">
            <div className="menu-item active">
              <i className="fas fa-home"></i>
              <div className="menu-item">
                  <NavLink to="/" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Dashboard</span>
                  </NavLink>
                </div>
            </div>
            
          </div>
          
          <div className="collapsible-section">
            <div 
              className="section-header" 
              onClick={() => toggleHumbuger('product')}
            >
              <i className="fa-solid fa-prescription-bottle"></i>
              <span>Store</span>
              <i className={`fas fa-chevron-${openSection.product ? 'up' : 'down'}`}></i>
            </div>
            {openSection.product && (
              <div className="section-content">
                <div className="menu-item">
                  <NavLink to="/uom" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Uom</span>
                  </NavLink>
                </div>
                
                <div className="menu-item">
                  <NavLink to="/sequence" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Sequence</span>
                  </NavLink>
                </div>

                <div className="menu-item">
                  <NavLink to="/store" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>store</span>
                  </NavLink>
                </div>

                <div className="menu-item">
                  <NavLink to="/codevalue" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>CodeValue</span>
                  </NavLink>
                </div>

                <div className="menu-item">
                  <NavLink to="/pricelist" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>PriceList</span>
                  </NavLink>
                </div>

                <div className="menu-item">
                  <NavLink to="/item" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Items</span>
                  </NavLink>
                </div>

                <div className="menu-item">
                  <NavLink to="/audit" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Audits</span>
                  </NavLink>
                </div>

                <div className="menu-item">
                  <NavLink to="/packaging" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Packaging</span>
                  </NavLink>
                </div>

                <div className="menu-item">
                  <NavLink to="/stock" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Stock</span>
                  </NavLink>
                </div>

                <div className="menu-item">
                  <NavLink to="/inventory" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Inventory</span>
                  </NavLink>
                </div>
              </div>
            )}

            
          </div>

           <div className="collapsible-section">
            <div 
              className="section-header" 
              onClick={() => toggleHumbuger('product')}
            >
              <i className="fa-solid fa-user"></i>
              <span>users</span>
              <i className={`fas fa-chevron-${openSection.product ? 'up' : 'down'}`}></i>
            </div>
            {openSection.product && (
              <div className="section-content">
                <div className="menu-item">
                  <NavLink to="/supplier" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Suppliers</span>
                  </NavLink>
                </div>
                
                <div className="menu-item">
                  <NavLink to="/person" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Persons</span>
                  </NavLink>
                </div>
                
                <div className="menu-item">
                  <NavLink to="/contact" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Contacts</span>
                  </NavLink>
                </div>

                <div className="menu-item">
                  <NavLink to="/employee" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                    <span>Employees</span>
                  </NavLink>
                </div>
              </div>
            )}

            
          </div>

          
          

          <div className="menu-section">
            <div className="menu-item">
              
              <NavLink to="/help" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                <i className="fas fa-question-circle me-2 "></i>
                <span>Help Center</span>
              </NavLink>
              
            </div>
            <div className="menu-item">
              <NavLink to="/logout" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                <i className="fa-solid fa-right-to-bracket me-2"></i>
                <span>Logout</span>
              </NavLink>
            </div>
            <div className="menu-item">
              <NavLink to="/settings" className={({isActive})=>isActive? 'nav-active':'menu-item active'}>
                <i className="fa-solid fa-gear me-2"></i>
                <span>Settings</span>
              </NavLink>
            </div>
          </div>
        </div>
        
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <i className={`fas fa-chevron-${isOpen ? 'right' : 'left'}`}></i>
        </div>

      </div>

    </div>
  )
}

export default SideBar