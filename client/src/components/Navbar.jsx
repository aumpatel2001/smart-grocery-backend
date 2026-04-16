import { Link } from 'react-router-dom';

// Navbar component: renders navigation links and user info based on auth state.
function Navbar({ user, onLogout }) {
  return (
    <div className="nav-block">
      <nav className="site-nav">
        {user ? (
          <>
            <Link className="nav-link" to="/groceries">Groceries</Link>
            <Link className="nav-link" to="/shopping-list">Shopping List</Link>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <button type="button" className="button button-secondary" onClick={onLogout}>
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </nav>
      {user && <p className="user-meta">Signed in as <strong>{user.name}</strong></p>}
    </div>
  );
}

export default Navbar;