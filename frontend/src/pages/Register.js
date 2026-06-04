import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'tenant' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success('Compte créé avec succès!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: '#0a0a14', border: '1px solid #2a2a40',
    borderRadius: '8px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', marginBottom: '1rem', boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a14',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        background: '#12122a', padding: '2.5rem', borderRadius: '16px',
        width: '100%', maxWidth: '420px', border: '1px solid #1e1e38'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.6rem', fontWeight: '700' }}>
          Créer un compte
        </h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Rejoignez ImmoTunisia
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ color: '#888', fontSize: '0.82rem' }}>Nom complet</label>
          <input type="text" placeholder="Ahmed Ben Ali" required
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />

          <label style={{ color: '#888', fontSize: '0.82rem' }}>Email</label>
          <input type="email" placeholder="votre@email.tn" required
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />

          <label style={{ color: '#888', fontSize: '0.82rem' }}>Mot de passe</label>
          <input type="password" placeholder="••••••••" required minLength={6}
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} />

          <label style={{ color: '#888', fontSize: '0.82rem' }}>Téléphone</label>
          <input type="tel" placeholder="+216 XX XXX XXX"
            value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />

          <label style={{ color: '#888', fontSize: '0.82rem' }}>Rôle</label>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle}>
            <option value="tenant">🔑 Locataire</option>
            <option value="owner">🏠 Propriétaire</option>
          </select>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.85rem', background: '#e94560',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '1rem', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Création...' : "Créer mon compte"}
          </button>
        </form>

        <p style={{ color: '#888', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Déjà un compte?{' '}
          <Link to="/login" style={{ color: '#e94560' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
