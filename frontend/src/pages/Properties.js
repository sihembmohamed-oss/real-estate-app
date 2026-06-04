import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';

const TYPES   = ['apartment', 'house', 'villa', 'studio'];
const CITIES  = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Nabeul', 'Sidi Bou Said'];

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    city:     searchParams.get('city') || '',
    type:     '',
    status:   'available',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    );
    api.get(`/properties?${params}`)
      .then(r => { setProperties(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filters]);

  const setFilter = (key, val) =>
    setFilters(f => ({ ...f, [key]: f[key] === val ? '' : val }));

  const inputStyle = {
    padding: '0.55rem 1rem',
    background: '#12122a',
    border: '1px solid #2a2a40',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          🏘️ Propriétés
        </h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>
          {properties.length} résultat{properties.length !== 1 ? 's' : ''} trouvé{properties.length !== 1 ? 's' : ''}
        </p>

        {/* Filters */}
        <div style={{
          background: '#12122a', border: '1px solid #1e1e38',
          borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem'
        }}>
          {/* Type buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilter('type', t)} style={{
                padding: '0.4rem 1.1rem', borderRadius: '20px', cursor: 'pointer',
                border: `1px solid ${filters.type === t ? '#e94560' : '#2a2a40'}`,
                background: filters.type === t ? '#e94560' : 'transparent',
                color: '#fff', fontSize: '0.85rem', transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <select value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} style={inputStyle}>
              <option value="">📍 Toutes les villes</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <input type="number" placeholder="Prix min (TND)" value={filters.minPrice}
              onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} style={inputStyle} />

            <input type="number" placeholder="Prix max (TND)" value={filters.maxPrice}
              onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} style={inputStyle} />

            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
              <option value="">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="rented">Loué</option>
            </select>

            <button onClick={() => setFilters({ city: '', type: '', status: 'available', minPrice: '', maxPrice: '' })}
              style={{
                background: 'transparent', color: '#e94560', border: '1px solid #e94560',
                borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
              }}>
              ✕ Réinitialiser
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Chargement...</div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏚️</p>
            <p>Aucune propriété ne correspond à vos critères.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
