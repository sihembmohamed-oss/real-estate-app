const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/properties  (avec filtres optionnels)
router.get('/', async (req, res) => {
  try {
    const { city, type, status, minPrice, maxPrice } = req.query;

    let query = `
      SELECT p.*, u.name AS owner_name, u.phone AS owner_phone
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (city)     { query += ' AND p.city LIKE ?';    params.push(`%${city}%`); }
    if (type)     { query += ' AND p.type = ?';       params.push(type); }
    if (status)   { query += ' AND p.status = ?';     params.push(status); }
    if (minPrice) { query += ' AND p.price >= ?';     params.push(minPrice); }
    if (maxPrice) { query += ' AND p.price <= ?';     params.push(maxPrice); }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/properties/stats/overview  (pour Grafana - AVANT /:id)
router.get('/stats/overview', async (req, res) => {
  try {
    const [total]    = await db.execute('SELECT COUNT(*) AS count FROM properties');
    const [available]= await db.execute("SELECT COUNT(*) AS count FROM properties WHERE status='available'");
    const [rented]   = await db.execute("SELECT COUNT(*) AS count FROM properties WHERE status='rented'");
    const [avgPrice] = await db.execute('SELECT AVG(price) AS avg FROM properties');
    const [byCity]   = await db.execute('SELECT city, COUNT(*) AS count FROM properties GROUP BY city');
    const [byType]   = await db.execute('SELECT type, COUNT(*) AS count FROM properties GROUP BY type');

    res.json({
      total:    total[0].count,
      available:available[0].count,
      rented:   rented[0].count,
      avgPrice: Math.round(avgPrice[0].avg || 0),
      byCity,
      byType
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/properties/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT p.*, u.name AS owner_name, u.phone AS owner_phone, u.email AS owner_email
       FROM properties p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Propriété non trouvée' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/properties  (auth obligatoire)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, type, address, city, area, rooms, bathrooms, image_url } = req.body;

    if (!title || !price || !type || !address || !city)
      return res.status(400).json({ message: 'Champs obligatoires manquants' });

    const [result] = await db.execute(
      `INSERT INTO properties
         (title, description, price, type, address, city, area, rooms, bathrooms, image_url, owner_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, type, address, city, area, rooms, bathrooms, image_url, req.user.id]
    );

    res.status(201).json({ id: result.insertId, message: 'Propriété créée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/properties/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, price, type, status, address, city, area, rooms, bathrooms, image_url } = req.body;

    await db.execute(
      `UPDATE properties
       SET title=?, description=?, price=?, type=?, status=?,
           address=?, city=?, area=?, rooms=?, bathrooms=?, image_url=?
       WHERE id=? AND owner_id=?`,
      [title, description, price, type, status, address, city, area, rooms, bathrooms, image_url,
       req.params.id, req.user.id]
    );

    res.json({ message: 'Propriété mise à jour' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/properties/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM properties WHERE id = ? AND owner_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0)
      return res.status(403).json({ message: 'Non autorisé ou propriété introuvable' });
    res.json({ message: 'Propriété supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
