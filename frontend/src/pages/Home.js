import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/properties?status=available').then(r => setProperties(r.data.slice(0, 6)));
  }, []);

  const stats = [
    { label: 'Propriétés', value: '500+', icon: '🏠' },
    { label: 'Villes', value: '12', icon: '🌆' },
    { label: 'Clients', value: '1200+', icon: '👥' },
    { label: 'Locations', value: '800+', icon: '🔑' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a14' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a14 0%, #1a0a1e 50%, #0a0a14 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #1e1e32',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Cercles décoratifs */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(233,69,96,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(233,69,96,0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <p style={{ color: '#e94560', fontSize: '0.9rem', letterSpacing: '3px', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Bienvenue sur
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700', marginBottom: '1rem', lineHeight: 1.2 }}>
          Trouvez votre<br />
          <span style={{ color: '#e94560' }}>maison idéale</span> en Tunisie
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
          Des milliers de propriétés disponibles à louer à travers tout le pays.
        </p>

        {/* Search bar */}
        <div style={{ display: 'flex', maxWidth: '520px', margin: '0 auto', gap: '0' }}>
          <input
            placeholder="🔍  Rechercher par ville, type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate(`/properties?city=${search}`)}
            style={{
              flex: 1, padding: '0.9rem 1.5rem',
              background: '#12122a', border: '1px solid #2a2a40',
              borderRight: 'none', borderRadius: '10px 0 0 10px',
              color: '#fff', fontSize: '0.95rem', outline: 'none'
            }}
          />
          <button
            onClick={() => navigate(`/properties?city=${search}`)}
            style={{
              padding: '0.9rem 1.8rem', background: '#e94560', color: '#fff',
              border: 'none', borderRadius: '0 10px 10px 0', cursor: 'pointer',
              fontSize: '0.95rem', fontWeight: '600'
            }}
          >
            Chercher
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px', background: '#1e1e32',
        borderBottom: '1px solid #1e1e32'
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: '#0a0a14', padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#e94560' }}>{s.value}</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Properties */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <p style={{ color: '#e94560', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              À la une
            </p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Propriétés Disponibles</h2>
          </div>
          <Link to="/properties" style={{
            color: '#e94560', border: '1px solid #e94560',
            padding: '0.5rem 1.2rem', borderRadius: '8px', fontSize: '0.9rem'
          }}>
            Voir tout →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a1e, #0a0a1e)',
        border: '1px solid #2a1a2e',
        margin: '0 2rem 4rem',
        borderRadius: '20px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>
          Vous avez un bien à louer?
        </h2>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>
          Publiez votre annonce gratuitement et touchez des milliers de locataires.
        </p>
        <Link to="/register" style={{
          background: '#e94560', color: '#fff',
          padding: '0.8rem 2rem', borderRadius: '10px',
          fontSize: '1rem', fontWeight: '600', display: 'inline-block'
        }}>
          Publier une annonce
        </Link>
      </div>
    </div>
  );
}
