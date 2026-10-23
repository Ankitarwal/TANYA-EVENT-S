import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tanya_events_super_secret_jwt_key_2026';

// Rate Limiting to prevent brute-force attacks in production
interface RateLimitRecord {
  attempts: number;
  lockUntil: number;
}
const failedAttempts = new Map<string, RateLimitRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

// Helper to check lockout
function isLockedOut(key: string): { locked: boolean; remainingMinutes: number } {
  const record = failedAttempts.get(key);
  if (!record) return { locked: false, remainingMinutes: 0 };
  if (Date.now() < record.lockUntil) {
    const remainingMinutes = Math.ceil((record.lockUntil - Date.now()) / 60000);
    return { locked: true, remainingMinutes };
  }
  if (Date.now() >= record.lockUntil && record.lockUntil > 0) {
    failedAttempts.delete(key);
  }
  return { locked: false, remainingMinutes: 0 };
}

// 1. Admin Login (Secure & Production-Ready)
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const rateLimitKey = `${cleanEmail}_${clientIp}`;

  // Check rate limit lockout
  const { locked, remainingMinutes } = isLockedOut(rateLimitKey);
  if (locked) {
    return res.status(429).json({
      success: false,
      message: `Too many failed login attempts. For security reasons, access is locked for ${remainingMinutes} more minute(s).`,
    });
  }

  try {
    const user = db.prepare('SELECT * FROM profiles WHERE LOWER(email) = ?').get(cleanEmail) as any;

    if (!user) {
      // Record failed attempt
      const rec = failedAttempts.get(rateLimitKey) || { attempts: 0, lockUntil: 0 };
      rec.attempts += 1;
      if (rec.attempts >= MAX_FAILED_ATTEMPTS) {
        rec.lockUntil = Date.now() + LOCKOUT_DURATION_MS;
        failedAttempts.set(rateLimitKey, rec);
        return res.status(429).json({
          success: false,
          message: 'Too many failed login attempts. Portal locked for 15 minutes to protect against brute-force attacks.',
        });
      }
      failedAttempts.set(rateLimitKey, rec);
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator email or password.',
      });
    }

    // Strict cryptographic bcrypt comparison
    const passwordMatch = bcrypt.compareSync(password.trim(), user.password_hash);
    if (!passwordMatch) {
      const rec = failedAttempts.get(rateLimitKey) || { attempts: 0, lockUntil: 0 };
      rec.attempts += 1;
      if (rec.attempts >= MAX_FAILED_ATTEMPTS) {
        rec.lockUntil = Date.now() + LOCKOUT_DURATION_MS;
        failedAttempts.set(rateLimitKey, rec);
        return res.status(429).json({
          success: false,
          message: 'Too many failed login attempts. Portal locked for 15 minutes to protect against brute-force attacks.',
        });
      }
      failedAttempts.set(rateLimitKey, rec);
      const remaining = MAX_FAILED_ATTEMPTS - rec.attempts;
      return res.status(401).json({
        success: false,
        message: `Invalid administrator email or password. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`,
      });
    }

    // Reset rate limiter on successful authentication
    failedAttempts.delete(rateLimitKey);

    const tokenPayload = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    return res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: tokenPayload,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
});

// 2. Change Admin Password (Authenticated)
router.post('/change-password', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Both current password and new password are required.' });
  }

  if (newPassword.trim().length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long for security.' });
  }

  try {
    const user = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.user.id) as any;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const matches = bcrypt.compareSync(currentPassword.trim(), user.password_hash);
    if (!matches) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword.trim(), salt);
    db.prepare('UPDATE profiles SET password_hash = ? WHERE id = ?').run(newHash, req.user.id);

    return res.json({
      success: true,
      message: 'Password successfully updated and secured.',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating password.' });
  }
});

// 3. Verify & Get Current Admin Profile
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const user = db.prepare('SELECT id, email, full_name, role, created_at FROM profiles WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  return res.json({ success: true, user });
});

export default router;
