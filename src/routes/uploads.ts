import { Router } from 'express';
import path from 'path';
import { config } from '../config';
import { requireAuth } from '../middleware/auth';

export const uploads = Router();
uploads.use(requireAuth);

uploads.get('/:name', (req, res) => {
  res.sendFile(path.join(config.uploadsDir, req.params.name));
});
