import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { AuthedRequest, requireAuth } from '../middleware/auth';

export const documents = Router();
documents.use(requireAuth);

const createSchema = z.object({ title: z.string().min(1).max(200), body: z.string().max(50000) });

documents.get('/', async (req: AuthedRequest, res) => {
  const { rows } = await pool.query('SELECT id, title FROM documents WHERE owner_id = $1 ORDER BY id DESC', [req.user!.id]);
  res.json(rows);
});

documents.get('/search', async (req: AuthedRequest, res) => {
  const q = String(req.query.q ?? '');
  const { rows } = await pool.query(
    'SELECT id, title FROM documents WHERE owner_id = $1 AND title ILIKE $2',
    [req.user!.id, `%${q}%`],
  );
  res.json(rows);
});

documents.post('/', async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid body' });
  const { rows } = await pool.query(
    'INSERT INTO documents (owner_id, title, body) VALUES ($1, $2, $3) RETURNING id',
    [req.user!.id, parsed.data.title, parsed.data.body],
  );
  res.status(201).json(rows[0]);
});

documents.get('/:id', async (req: AuthedRequest, res) => {
  const { rows } = await pool.query('SELECT id, title, body FROM documents WHERE id = $1 AND owner_id = $2', [
    Number(req.params.id),
    req.user!.id,
  ]);
  if (!rows.length) return res.status(404).json({ error: 'not found' });
  res.json(rows[0]);
});
