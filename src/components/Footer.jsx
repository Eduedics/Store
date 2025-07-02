

function Footer() {
    const today = new Date().getFullYear()
  return (
    <div className="footer">
        <div className="footer-content">
            <p>© {today} . All rights reserved.</p>
            <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
            </div>
        </div>
    </div>
  )
}

export default Footer