

function Content() {
  return (
    <div className="content">
          <div className="card">
            <h2>Welcome to Stock Inventory</h2>
            <div className="stats-container">
              <div className="stat-card">
                <i className="fas fa-users"></i>
                <h3>12</h3>
                <p>Total Users</p>
              </div>
              <div className="stat-card">
                <i className="fa-solid fa-truck"></i>
                <h3>123</h3>
                <p>Total Products</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-box"></i>
                <h3>176</h3>
                <p>Total sales</p>
              </div>
              <div className="stat-card">
                <i className="fa-solid fa-arrow-trend-up"></i>
                <h3>123</h3>
                <p>remaining Products</p>
              </div>
              <div className="stat-card">
                <i className="fa-solid fa-sack-dollar"></i>
                <h3>ksh:1000 </h3>
                <p>Profit Made</p>
              </div>
            </div>
            </div>
    </div>
    
  )
}

export default Content