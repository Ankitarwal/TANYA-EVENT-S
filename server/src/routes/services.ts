import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Helper to format service
function formatService(row: any) {
  let features = [];
  try {
    features = JSON.parse(row.features || '[]');
  } catch (e) {
    features = [];
  }

  const packagesRaw = db.prepare('SELECT * FROM packages WHERE service_id = ? ORDER BY price ASC').all(row.id) as any[];
  const packages = packagesRaw.map((pkg) => {
    let pkgFeatures = [];
    try {
      pkgFeatures = JSON.parse(pkg.features || '[]');
    } catch (e) {
      pkgFeatures = [];
    }
    return {
      id: pkg.id,
      serviceId: pkg.service_id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      features: pkgFeatures,
      isPopular: Boolean(pkg.is_popular),
      isActive: Boolean(pkg.is_active),
    };
  });

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.short_description,
    imageUrl: row.image_url,
    startingPrice: row.starting_price,
    features,
    isActive: Boolean(row.is_active),
    packages,
    createdAt: row.created_at,
  };
}

// Get all active services
router.get('/', (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.all === 'true';
    const query = includeInactive 
      ? 'SELECT * FROM services ORDER BY created_at ASC'
      : 'SELECT * FROM services WHERE is_active = 1 ORDER BY created_at ASC';
    
    const rows = db.prepare(query).all() as any[];
    const services = rows.map(formatService);
    return res.json({ success: true, services });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve services.' });
  }
});

// Get single service by slug
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT * FROM services WHERE slug = ?').get(req.params.slug) as any;
    if (!row) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    return res.json({ success: true, service: formatService(row) });
  } catch (error: any) {
    console.error('Error fetching service:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve service.' });
  }
});

// Admin: Create service
router.post('/', authenticateToken, (req: Request, res: Response) => {
  const { name, slug, description, shortDescription, imageUrl, startingPrice, features, isActive } = req.body;

  if (!name || !slug || !description) {
    return res.status(400).json({ success: false, message: 'Name, slug, and description are required.' });
  }

  try {
    const id = `srv-${Date.now()}`;
    const insert = db.prepare(`
      INSERT INTO services (id, name, slug, description, short_description, image_url, starting_price, features, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      name,
      slug.toLowerCase().replace(/\s+/g, '-'),
      description,
      shortDescription || description.slice(0, 120),
      imageUrl || '/images/hero_mandap.jpg',
      startingPrice ? Number(startingPrice) : null,
      JSON.stringify(features || []),
      isActive !== undefined ? (isActive ? 1 : 0) : 1
    );

    const created = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    return res.status(201).json({ success: true, service: formatService(created) });
  } catch (error: any) {
    console.error('Error creating service:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create service.' });
  }
});

// Admin: Update service
router.put('/:id', authenticateToken, (req: Request, res: Response) => {
  const { name, slug, description, shortDescription, imageUrl, startingPrice, features, isActive } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const update = db.prepare(`
      UPDATE services 
      SET name = ?, slug = ?, description = ?, short_description = ?, image_url = ?, starting_price = ?, features = ?, is_active = ?
      WHERE id = ?
    `);

    update.run(
      name,
      slug.toLowerCase().replace(/\s+/g, '-'),
      description,
      shortDescription,
      imageUrl,
      startingPrice !== null && startingPrice !== undefined ? Number(startingPrice) : null,
      JSON.stringify(features || []),
      isActive ? 1 : 0,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    return res.json({ success: true, service: formatService(updated) });
  } catch (error: any) {
    console.error('Error updating service:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to update service.' });
  }
});

// Admin: Delete service
router.delete('/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const existing = db.prepare('SELECT id FROM services WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
});

// Admin: Add package to service
router.post('/:serviceId/packages', authenticateToken, (req: Request, res: Response) => {
  const { name, description, price, features, isPopular, isActive } = req.body;

  try {
    const id = `pkg-${Date.now()}`;
    const insert = db.prepare(`
      INSERT INTO packages (id, service_id, name, description, price, features, is_popular, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      req.params.serviceId,
      name,
      description,
      price ? Number(price) : null,
      JSON.stringify(features || []),
      isPopular ? 1 : 0,
      isActive !== undefined ? (isActive ? 1 : 0) : 1
    );

    return res.status(201).json({ success: true, message: 'Package added successfully.' });
  } catch (error: any) {
    console.error('Error adding package:', error);
    return res.status(500).json({ success: false, message: 'Failed to add package.' });
  }
});

// Admin: Delete package
router.delete('/packages/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM packages WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Package deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting package:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete package.' });
  }
});

export default router;
