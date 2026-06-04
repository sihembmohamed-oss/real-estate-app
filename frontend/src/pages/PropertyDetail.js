import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [booking, setBooking]   = useState({ start_date: '', end_date: '', message: '' });
  const [sending, setSending]   = useState(false);

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(r => { setProperty(r.data); setLoading(false); })
      .catch(() => { setLoading(false); navigate('/properties'); });
  }, [id, navigate]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSending(true);
    try {
      await api.post('/bookings', { property_id: id, ...booking });
      toast.success('Demande envoyée avec succès!');
      setBooking({ start_date: '', end_date: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '6rem', background: '#0a0a14', minHeight: '100vh', color: '#888' }}>
      Chargement...
    </div>
  );

  if (!property) return null;

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: '#0a0a14', border: '1px solid #2a2a40',
    borderRadius: '8px', color: '#fff', fontSize: '0.9rem',
    outline: 'none', marginBottom: '0.75rem', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          background: 'transparent', color: '#888', border: 'none',
          cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem'
        }}>
          ← Retour
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>

          {/* Left */}
          <div>
            <img src={property.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900'}
              alt={property.title}
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.5rem' }}
            />

            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>{property.title}</h1>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>📍 {property.address}, {property.city}</p>

            {/* Specs */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px', background: '#1e1e32', borderRadius: '12px',
              overflow: 'hidden', marginBottom: '1.5rem'
            }}>
              {[
                { icon: '🛏', label: 'Chambres', val: property.rooms },
                { icon: '🚿', label: 'SDB', val: property.bathrooms },
                { icon: '📐', label: 'Surface', val: `${property.area} m²` },
                { icon: '🏷️', label: 'Type', val: property.type },
              ].map(s => (
                <div key={s.label} style={{ background: '#12122a', padding: '1.2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: '600', color: '#fff' }}>{s.val}</div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background: '#12122a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1e1e38' }}>
              <h3 style={{ marginBottom: '0.75rem', color: '#e94560' }}>Description</h3>
              <p style={{ color: '#aaa', lineHeight: 1.7 }}>
                {property.description || 'Aucune description fournie.'}
              </p>
            </div>

            {/* Owner */}
            {property.owner_name && (
              <div style={{ background: '#12122a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1e1e38', marginTop: '1rem' }}>
                <h3 style={{ marginBottom: '0.75rem', color: '#e94560' }}>Propriétaire</h3>
                <p style={{ color: '#fff' }}>👤 {property.owner_name}</p>
                {property.owner_phone && <p style={{ color: '#888', marginTop: '0.3rem' }}>📞 {property.owner_phone}</p>}
                {property.owner_email && <p style={{ color: '#888', marginTop: '0.3rem' }}>✉️ {property.owner_email}</p>}
              </div>
            )}
          </div>

          {/* Right - Booking */}
          <div>
            <div style={{
              background: '#12122a', border: '1px solid #1e1e38',
              borderRadius: '16px', padding: '1.5rem', position: 'sticky', top: '80px'
            }}>
              <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#e94560', marginBottom: '0.3rem' }}>
                {Number(property.price).toLocaleString()} TND
                <span style={{ color: '#888', fontWeight: '400', fontSize: '1rem' }}>/mois</span>
              </p>
              <p style={{ color: '#22c55e', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                ✅ {property.status === 'available' ? 'Disponible maintenant' : 'Non disponible'}
              </p>

              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Envoyer une demande</h3>
              <form onSubmit={handleBook}>
                <label style={{ color: '#888', fontSize: '0.8rem' }}>Date de début</label>
                <input type="date" value={booking.start_date} required
                  onChange={e => setBooking(b => ({ ...b, start_date: e.target.value }))}
                  style={inputStyle} />
                <label style={{ color: '#888', fontSize: '0.8rem' }}>Date de fin (optionnel)</label>
                <input type="date" value={booking.end_date}
                  onChange={e => setBooking(b => ({ ...b, end_date: e.target.value }))}
                  style={inputStyle} />
                <label style={{ color: '#888', fontSize: '0.8rem' }}>Message</label>
                <textarea rows={4} placeholder="Votre message au propriétaire..."
                  value={booking.message}
                  onChange={e => setBooking(b => ({ ...b, message: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical' }} />
                <button type="submit" disabled={sending || property.status !== 'available'} style={{
                  width: '100%', padding: '0.85rem',
                  background: property.status === 'available' ? '#e94560' : '#444',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  cursor: property.status === 'available' ? 'pointer' : 'not-allowed',
                  fontSize: '1rem', fontWeight: '600'
                }}>
                  {sending ? 'Envoi...' : user ? 'Envoyer la demande' : 'Connectez-vous pour réserver'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
