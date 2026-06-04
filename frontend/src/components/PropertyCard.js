import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
  const { id, title, city, type, price, rooms, bathrooms, area, image_url, status } = property;

  const statusColor = { available: '#22c55e', rented: '#f59e0b', sold: '#ef4444' };
  const statusLabel = { available: 'Disponible', rented: 'Loué', sold: 'Vendu' };
  const typeIcon    = { apartment: '🏢', house: '🏠', villa: '🏡', studio: '🛏' };

  return (
    <Link to={`/properties/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#12122a',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1px solid #1e1e38',
        transition: 'transform 0.25s, box-shadow 0.25s',
        cursor: 'pointer'
      }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(233,69,96,0.15)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative' }}>
          <img
            src={image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}
            alt={title}
            style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
          />
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(0,0,0,0.7)', color: '#fff',
            padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem'
          }}>
            {typeIcon[type]} {type}
          </span>
          <span style={{
            position: 'absolute', top: '12px', right: '12px',
            background: statusColor[status] || '#22c55e',
            color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem'
          }}>
            {statusLabel[status] || status}
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.4rem', color: '#fff' }}>
            {title}
          </h3>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            📍 {city}
          </p>
          <div style={{ display: 'flex', gap: '1rem', color: '#888', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
            <span>🛏 {rooms} ch</span>
            <span>🚿 {bathrooms} SDB</span>
            <span>📐 {area} m²</span>
          </div>
          <p style={{ color: '#e94560', fontWeight: '700', fontSize: '1.15rem' }}>
            {Number(price).toLocaleString()} TND
            <span style={{ color: '#888', fontWeight: '400', fontSize: '0.8rem' }}>/mois</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
