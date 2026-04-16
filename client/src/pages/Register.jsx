import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, login, saveSession } from '../api';

function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await register({ name, email, password });
      setSuccess('Register succeeded! Logging you in...');
      const loginData = await login({ email, password });
      saveSession({ token: loginData.token, user: loginData.user });
      onRegister(loginData.user);
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
        <span className="eyebrow">begin your ritual</span>
        <h2>Create an account for quiet pantry control.</h2>
        <p>Set up your grocery experience in a calm, elegant workspace designed for focus.</p>
      </section>

      <section className="card auth-card">
        <h3>Create account</h3>
        {(error || success) && <p className={error ? 'error' : 'success'}>{error || success}</p>}
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field-group">
            <label>Name</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label>Email</label>
            <input
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <button type="submit" className="button button-primary" disabled={loading}>
            <span>Continue</span>
          </button>
        </form>
        <p className="auth-footnote">
          Already registered? <Link className="button-link" to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  );
}

export default Register;
