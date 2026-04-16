import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from './api';
import Login from './pages/Login';
import Register from './pages/Register';
import Groceries from './pages/Groceries';
import ShoppingList from './pages/ShoppingList';
import Dashboard from './pages/Dashboard';
import AuthRoute from './AuthRoute';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <p className="eyebrow">curated pantry</p>
          <h1>Smart Grocery</h1>
        </div>
        <Navbar user={user} onLogout={handleLogout} />
      </header>

      <main className="page-content">
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
      </main>
    </div>
  );
}

export default App;
