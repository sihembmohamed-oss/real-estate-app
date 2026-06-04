import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings]     = useState([]);
  const [properties, setProperties] = useState([]);
  const [stats, setStats]           = useState(null);
  const [tab, setTab]               = useState('bookings');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings'),
      api.get('/properties'),
      api.get('/properties/stats/overview')
    ]).then(([b, p, s]) => {
      setBookings(b.data);
      setProperties(p.data.filter(pr => pr.owner_id === user?.id));
      setStats(s.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const updateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b));
      toast.success('Statut mis à jour');
    } catch {
      toast.error('Erreur');
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm('Supprimer cette propriété?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(ps => ps.filter(p => p.id !== id));
      toast.success('Propriété supprimée');
    } catch {
      toast.error('Erreur');
    }
  };

  const statusColor = { pending: '#f59e0b', approved: '#22c55e', rejected: '#ef4444', cancelled: '#888' };
  const statusLabel = { pending: '⏳ En attente', approved: '✅ Approuvé', rejected: '❌ Rejeté', cancelled: '🚫 Annulé' };

  const cardStyle = (color) => ({
    background: '#12122a', border: `1px solid ${color}22`,
    borderRadius: '12px', padding: '1.5rem', textAlign: 'center'
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '6rem', background: '#0a0a14', minHeight: '100vh', color: '#888' }}>
      Chargement...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Dashboard</h1>
            <p style={{ color: '#888' }}>Bonjour, {user?.name} 👋</p>
          </div>
          <Link to="/add-property" style={{
            background: '#e94560', color: '#fff',
            padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600'
          }}>
            + Ajouter propriété
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={cardStyle('#e94560')}>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#e94560' }}>{stats.total}</p>
              <p style={{ color: '#888', fontSize: '0.85rem' }}>Total propriétés</p>
            </div>
            <div style={cardStyle('#22c55e')}>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#22c55e' }}>{stats.available}</p>
              <p style={{ color: '#888', fontSize: '0.85rem' }}>Disponibles</p>
            </div>
            <div style={cardStyle('#f59e0b')}>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>{stats.rented}</p>
              <p style={{ color: '#888', fontSize: '0.85rem' }}>Louées</p>
            </div>
            <div style={cardStyle('#8b5cf6')}>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>{stats.avgPrice} TND</p>
              <p style={{ color: '#888', fontSize: '0.85rem' }}>Prix moyen</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['bookings', 'properties'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${tab === t ? '#e94560' : '#2a2a40'}`,
              background: tab === t ? '#e94560' : 'transparent',
              color: '#fff', fontWeight: tab === t ? '600' : '400'
            }}>
              {t === 'bookings' ? '📋 Réservations' : '🏠 Mes propriétés'}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                Aucune réservation pour le moment.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookings.map(b => (
                  <div key={b.id} style={{
                    background: '#12122a', border: '1px solid #1e1e38',
                    borderRadius: '12px', padding: '1.25rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ fontWeight: '600' }}>{b.property_title}</p>
                      <p style={{ color: '#888', fontSize: '0.85rem' }}>
                        📅 {b.start_date?.slice(0, 10)}
                        {b.tenant_name && ` · 👤 ${b.tenant_name}`}
                      </p>
                      {b.message && <p style={{ color: '#aaa', fontSize: '0.82rem', marginTop: '0.3rem' }}>💬 {b.message}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{
                        background: `${statusColor[b.status]}22`,
                        color: statusColor[b.status],
                        padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem'
                      }}>
                        {statusLabel[b.status]}
                      </span>
                      {user?.role !== 'tenant' && b.status === 'pending' && (
                        <>
                          <button onClick={() => updateBookingStatus(b.id, 'approved')} style={{
                            background: '#22c55e22', color: '#22c55e',
                            border: '1px solid #22c55e', padding: '0.3rem 0.8rem',
                            borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
                          }}>✅ Approuver</button>
                          <button onClick={() => updateBookingStatus(b.id, 'rejected')} style={{
                            background: '#ef444422', color: '#ef4444',
                            border: '1px solid #ef4444', padding: '0.3rem 0.8rem',
                            borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
                          }}>❌ Rejeter</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Properties Tab */}
        {tab === 'properties' && (
          <div>
            {properties.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                Vous n'avez pas encore de propriétés.{' '}
                <Link to="/add-property" style={{ color: '#e94560' }}>Ajouter une</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {properties.map(p => (
                  <div key={p.id} style={{
                    background: '#12122a', border: '1px solid #1e1e38',
                    borderRadius: '12px', padding: '1.25rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={p.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100'}
                        alt={p.title} style={{ width: '70px', height: '55px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div>
                        <p style={{ fontWeight: '600' }}>{p.title}</p>
                        <p style={{ color: '#888', fontSize: '0.85rem' }}>📍 {p.city} · {p.type}</p>
                        <p style={{ color: '#e94560', fontWeight: '600' }}>{Number(p.price).toLocaleString()} TND/mois</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/properties/${p.id}`} style={{
                        background: '#1e1e38', color: '#aaa',
                        padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem'
                      }}>
                        Voir
                      </Link>
                      <button onClick={() => deleteProperty(p.id)} style={{
                        background: '#ef444422', color: '#ef4444',
                        border: '1px solid #ef4444', padding: '0.4rem 0.9rem',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem'
                      }}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
