import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

function Layout() {
  return (
    <div dir="rtl" className="layout">
      {/* ناوبری اصلی */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" className="brand-link">
              <span className="brand-icon">🚀</span>
              <span className="brand-text">TetraSaaS v3.2</span>
            </Link>
          </div>
          
          <div className="nav-menu">
            <Link to="/" className="nav-link active">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">صفحه اصلی</span>
            </Link>
            <Link to="/projects" className="nav-link">
              <span className="nav-icon">📁</span>
              <span className="nav-text">پروژه‌ها</span>
            </Link>
            <Link to="/services" className="nav-link">
              <span className="nav-icon">⚡</span>
              <span className="nav-text">سرویس‌ها</span>
            </Link>
            <Link to="/nlp" className="nav-link">
              <span className="nav-icon">🧠</span>
              <span className="nav-text">پردازش NLP</span>
            </Link>
            <Link to="/dashboard" className="nav-link">
              <span className="nav-icon">📊</span>
              <span className="nav-text">داشبورد</span>
            </Link>
          </div>
          
          <div className="nav-status">
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>آنلاین</span>
            </div>
          </div>
        </div>
      </nav>

      {/* محتوای اصلی */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* فوتر */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-stats">
            <span className="stat-item">
              <strong>۲۵۶</strong> پروژه NLP
            </span>
            <span className="stat-item">
              <strong>۳۲</strong> سرویس AI
            </span>
            <span className="stat-item">
              <strong>۱۵,۰۰۰+</strong> کاربر
            </span>
          </div>
          <div className="footer-copyright">
            © ۲۰۲۴ TetraSaaS • نسخه ۳.۲ • API فعال
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
