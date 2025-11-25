import fs from 'fs';
import multer from 'multer';
import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import { env } from '../../config/env.js';
import { deleteAsset, handleUpload, listAssets } from '../../controllers/uploadController.js';

const router = Router();

if (!fs.existsSync(env.uploadDir)) {
  fs.mkdirSync(env.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', authenticate, upload.single('file'), handleUpload);
router.delete('/:id', authenticate, deleteAsset);
router.get('/', authenticate, listAssets);

export default router;
