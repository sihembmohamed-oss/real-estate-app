import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? '#e94560' : '#ccc',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: isActive(path) ? '600' : '400',
    transition: 'color 0.2s'
  });

  return (
    <nav style={{
      background: 'rgba(10,10,20,0.95)',
      backdropFilter: 'blur(10px)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #1e1e32',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <Link to="/" style={{ color: '#e94560', fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
        🏠 ImmoTunisia
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/"           style={linkStyle('/')}>Accueil</Link>
        <Link to="/properties" style={linkStyle('/properties')}>Propriétés</Link>

        {user ? (
          <>
            <Link to="/dashboard"    style={linkStyle('/dashboard')}>Dashboard</Link>
            <Link to="/add-property" style={linkStyle('/add-property')}>+ Ajouter</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#aaa', fontSize: '0.85rem' }}>
                👤 {user.name}
              </span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                style={{
                  background: 'transparent',
                  color: '#e94560',
                  border: '1px solid #e94560',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.target.style.background = '#e94560'; e.target.style.color = '#fff'; }}
                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#e94560'; }}
              >
                Déconnexion
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" style={{
              color: '#fff', border: '1px solid #333',
              padding: '0.35rem 1rem', borderRadius: '6px', fontSize: '0.9rem'
            }}>
              Connexion
            </Link>
            <Link to="/register" style={{
              background: '#e94560', color: '#fff',
              padding: '0.35rem 1rem', borderRadius: '6px', fontSize: '0.9rem'
            }}>
              Inscription
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
