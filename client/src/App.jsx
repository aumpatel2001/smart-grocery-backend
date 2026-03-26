import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from './api';
import Login from './pages/Login';
import Register from './pages/Register';
import Groceries from './pages/Groceries';
import ShoppingList from './pages/ShoppingList';
import Dashboard from './pages/Dashboard';
import AuthRoute from './AuthRoute';
import Navbar from './components/Navbar';

function App() {
  // user state is loaded from localStorage session if present
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  // no auto-redirect from App root: `AuthRoute` ensures only authenticated access to guarded pages
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="container">
      <header className="card">
        <h1>Smart Grocery</h1>
        <Navbar user={user} onLogout={handleLogout} />
      </header>

      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onRegister={setUser} />} />
        <Route
          path="/groceries"
          element={<AuthRoute><Groceries /></AuthRoute>}
        />
        <Route
          path="/shopping-list"
          element={<AuthRoute><ShoppingList /></AuthRoute>}
        />
        <Route
          path="/dashboard"
          element={<AuthRoute><Dashboard /></AuthRoute>}
        />
      </Routes>
    </div>
  );
}

export default App;
