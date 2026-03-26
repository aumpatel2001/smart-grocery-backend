import { Link } from 'react-router-dom';

// Navbar component: renders navigation links and user info based on auth state.
function Navbar({ user, onLogout }) {
  return (
    <>
      <nav className="nav">
        {user ? (
          <>
            <Link to="/groceries">Groceries</Link>
            <Link to="/shopping-list">Shopping List</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      {user && <p>Signed in as {user.name}</p>}
    </>
  );
}

export default Navbar;