import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="card">
      <h2>Register</h2>
      {(error || success) && <p className={error ? 'error' : 'success'}>{error || success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <button type="submit" disabled={loading}>Register</button>
      </form>
    </div>
  );
}

export default Register;
