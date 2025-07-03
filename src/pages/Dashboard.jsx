

function Content() {
  return (
  <div className="content-dashboard">
    <div className="card-dashboard p-3">
      <h2 className="text-center mb-4">Welcome to Stock Inventory</h2>
      <div className="stats-container-dashboard d-flex flex-wrap justify-content-center">
        <div className="p-2" style={{ flex: '1 1 200px', maxWidth: '250px' }}>
          <div className="stat-card-dashboard text-center">
            <i className="fas fa-users fa-2x mb-2"></i>
            <h3>12</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="p-2" style={{ flex: '1 1 200px', maxWidth: '250px' }}>
          <div className="stat-card-dashboard text-center">
            <i className="fa-solid fa-truck fa-2x mb-2"></i>
            <h3>123</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="p-2" style={{ flex: '1 1 200px', maxWidth: '250px' }}>
          <div className="stat-card-dashboard text-center">
            <i className="fas fa-box fa-2x mb-2"></i>
            <h3>176</h3>
            <p>Total Sales</p>
          </div>
        </div>

        <div className="p-2" style={{ flex: '1 1 200px', maxWidth: '250px' }}>
          <div className="stat-card-dashboard text-center">
            <i className="fa-solid fa-arrow-trend-up fa-2x mb-2"></i>
            <h3>123</h3>
            <p>Remaining Products</p>
          </div>
        </div>

        <div className="p-2" style={{ flex: '1 1 200px', maxWidth: '250px' }}>
          <div className="stat-card-dashboard text-center">
            <i className="fa-solid fa-sack-dollar fa-2x mb-2"></i>
            <h3>Ksh: 1000</h3>
            <p>Profit Made</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default Content