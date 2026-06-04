const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/bookings  (admin voit tout, tenant voit les siennes)
router.get('/', auth, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === 'admin') {
      query = `
        SELECT b.*, p.title AS property_title, p.city,
               u.name AS tenant_name, u.email AS tenant_email
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON b.tenant_id = u.id
        ORDER BY b.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT b.*, p.title AS property_title, p.city, p.price,
               p.image_url AS property_image
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        WHERE b.tenant_id = ?
        ORDER BY b.created_at DESC
      `;
      params = [req.user.id];
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bookings  (créer une demande)
router.post('/', auth, async (req, res) => {
  try {
    const { property_id, start_date, end_date, message } = req.body;

    if (!property_id || !start_date)
      return res.status(400).json({ message: 'Propriété et date de début requis' });

    // Vérifier que la propriété existe et est disponible
    const [props] = await db.execute(
      "SELECT id FROM properties WHERE id = ? AND status = 'available'",
      [property_id]
    );
    if (!props.length)
      return res.status(400).json({ message: 'Propriété non disponible' });

    const [result] = await db.execute(
      'INSERT INTO bookings (property_id, tenant_id, start_date, end_date, message) VALUES (?, ?, ?, ?, ?)',
      [property_id, req.user.id, start_date, end_date || null, message || null]
    );

    res.status(201).json({ id: result.insertId, message: 'Demande de réservation envoyée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id/status  (changer le statut)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'approved', 'rejected', 'cancelled'];

    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Statut invalide' });

    await db.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    // Si approuvé → marquer la propriété comme louée
    if (status === 'approved') {
      const [booking] = await db.execute('SELECT property_id FROM bookings WHERE id = ?', [req.params.id]);
      if (booking.length) {
        await db.execute(
          "UPDATE properties SET status = 'rented' WHERE id = ?",
          [booking[0].property_id]
        );
      }
    }

    res.json({ message: 'Statut mis à jour' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/bookings/:id  (annuler)
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM bookings WHERE id = ? AND tenant_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Réservation annulée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
