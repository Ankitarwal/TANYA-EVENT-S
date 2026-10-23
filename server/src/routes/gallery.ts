import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get gallery items (with optional category filter)
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, all } = req.query;
    let query = 'SELECT * FROM gallery WHERE 1=1';
    const params: any[] = [];

    if (all !== 'true') {
      query += ' AND is_published = 1';
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params) as any[];
    const items = rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      description: r.description,
      imageUrl: r.image_url,
      eventDate: r.event_date,
      isPublished: Boolean(r.is_published),
      createdAt: r.created_at,
    }));

    return res.json({ success: true, items });
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve gallery items.' });
  }
});

// Admin: Add gallery photo
router.post('/', authenticateToken, (req: Request, res: Response) => {
  const { title, category, description, imageUrl, eventDate, isPublished } = req.body;

  if (!title || !category || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Title, category, and image URL are required.' });
  }

  try {
    const id = `gal-${Date.now()}`;
    const insert = db.prepare(`
      INSERT INTO gallery (id, title, category, description, image_url, event_date, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      title,
      category,
      description || '',
      imageUrl,
      eventDate || null,
      isPublished !== undefined ? (isPublished ? 1 : 0) : 1
    );

    const created = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id) as any;
    return res.status(201).json({
      success: true,
      item: {
        id: created.id,
        title: created.title,
        category: created.category,
        description: created.description,
        imageUrl: created.image_url,
        eventDate: created.event_date,
        isPublished: Boolean(created.is_published),
        createdAt: created.created_at,
      },
    });
  } catch (error: any) {
    console.error('Error adding gallery item:', error);
    return res.status(500).json({ success: false, message: 'Failed to add gallery item.' });
  }
});

// Admin: Delete gallery photo
router.delete('/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const existing = db.prepare('SELECT id FROM gallery WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Gallery item deleted.' });
  } catch (error: any) {
    console.error('Error deleting gallery item:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete gallery item.' });
  }
});

export default router;
