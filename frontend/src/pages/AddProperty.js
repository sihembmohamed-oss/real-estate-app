import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Nabeul', 'Sidi Bou Said', 'Hammamet', 'Gabès', 'Kairouan'];

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    type: 'apartment', address: '', city: 'Tunis',
    area: '', rooms: '', bathrooms: '', image_url: ''
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/properties', form);
      toast.success('Propriété ajoutée!');
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
    outline: 'none', boxSizing: 'border-box', fontFamily: 'Sora, sans-serif'
  };

  const label = (text) => (
    <label style={{ color: '#888', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', marginTop: '1rem' }}>
      {text}
    </label>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', padding: '2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <button onClick={() => navigate(-1)} style={{
          background: 'transparent', color: '#888', border: 'none',
          cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem'
        }}>
          ← Retour
        </button>

        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          ➕ Ajouter une propriété
        </h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Remplissez les informations de votre bien</p>

        <div style={{ background: '#12122a', border: '1px solid #1e1e38', borderRadius: '16px', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>

            {label('Titre *')}
            <input placeholder="Ex: Villa moderne avec piscine" required
              value={form.title} onChange={e => set('title', e.target.value)} style={inputStyle} />

            {label('Description')}
            <textarea rows={4} placeholder="Décrivez votre propriété..."
              value={form.description} onChange={e => set('description', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                {label('Prix (TND/mois) *')}
                <input type="number" placeholder="1500" required min="0"
                  value={form.price} onChange={e => set('price', e.target.value)} style={inputStyle} />
              </div>
              <div>
                {label('Type *')}
                <select value={form.type} onChange={e => set('type', e.target.value)} style={inputStyle}>
                  <option value="apartment">🏢 Appartement</option>
                  <option value="house">🏠 Maison</option>
                  <option value="villa">🏡 Villa</option>
                  <option value="studio">🛏 Studio</option>
                </select>
              </div>
            </div>

            {label('Adresse *')}
            <input placeholder="Rue, quartier..." required
              value={form.address} onChange={e => set('address', e.target.value)} style={inputStyle} />

            {label('Ville *')}
            <select value={form.city} onChange={e => set('city', e.target.value)} style={inputStyle}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                {label('Surface (m²)')}
                <input type="number" placeholder="90" min="0"
                  value={form.area} onChange={e => set('area', e.target.value)} style={inputStyle} />
              </div>
              <div>
                {label('Chambres')}
                <input type="number" placeholder="3" min="0"
                  value={form.rooms} onChange={e => set('rooms', e.target.value)} style={inputStyle} />
              </div>
              <div>
                {label('Salles de bain')}
                <input type="number" placeholder="2" min="0"
                  value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} style={inputStyle} />
              </div>
            </div>

            {label('URL de l\'image')}
            <input placeholder="https://example.com/photo.jpg"
              value={form.image_url} onChange={e => set('image_url', e.target.value)} style={inputStyle} />

            {/* Image preview */}
            {form.image_url && (
              <img src={form.image_url} alt="preview"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', marginTop: '0.75rem' }}
                onError={e => e.target.style.display = 'none'}
              />
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.9rem', marginTop: '1.5rem',
              background: '#e94560', color: '#fff', border: 'none',
              borderRadius: '10px', fontSize: '1rem', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Publication...' : '🚀 Publier la propriété'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
