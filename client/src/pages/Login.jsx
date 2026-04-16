import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, saveSession } from '../api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      saveSession({ token: data.token, user: data.user });
      onLogin(data.user);
      navigate('/groceries');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell auth-page">
      <section className="section-header">
        <span className="eyebrow">Return to curated living</span>
        <h2>Sign in and keep your pantry intentional.</h2>
        <p>Every grocery item becomes a deliberate choice from the moment it enters your kitchen.</p>
      </section>

      <section className="card auth-card">
        <h3>Sign In</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field-group">
            <label>Email</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button button-primary" disabled={loading}>
            <span>Continue</span>
          </button>
        </form>
        <p className="auth-footnote">
          Don’t have an account? <Link className="button-link" to="/register">Create one</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;
