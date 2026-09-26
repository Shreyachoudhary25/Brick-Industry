import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    // 1. Ensure token is saved under all keys expected by dashboard & context
    localStorage.setItem('token', data.token);
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('admin', JSON.stringify(data));

    // 2. Update context state
    if (login) {
      login(data);
    }

    // 3. Navigate to Dashboard
    navigate('/admin');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#FAF9F6'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '2.5rem',
        borderTop: '5px solid #A63D2F'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#4A2C23', margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>Management Portal</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Sign in to manage inquiries and quotes</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFEBEE',
            color: '#C62828',
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.35rem' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                  border: '1px solid #DDD',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.35rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                  border: '1px solid #DDD',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#A63D2F',
              color: '#FFF',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;