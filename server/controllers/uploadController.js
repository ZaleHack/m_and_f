import { query } from '../config/db.js';

export const handleUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier' });
    }
    const { scope } = req.body;
    const [result] = await query(
      `INSERT INTO media_assets (user_id, scope, path, mime_type, size_bytes, metadata)
       VALUES (:user_id, :scope, :path, :mime_type, :size_bytes, :metadata)`,
      {
        user_id: req.user?.id || null,
        scope: scope || 'menu',
        path: req.file.path,
        mime_type: req.file.mimetype,
        size_bytes: req.file.size,
        metadata: JSON.stringify({ originalname: req.file.originalname }),
      }
    );
    res.status(201).json({ id: result.insertId, url: req.file.path });
  } catch (error) {
    next(error);
  }
};

export const deleteAsset = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM media_assets WHERE id = :id', { id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listAssets = async (_req, res, next) => {
  try {
    const [rows] = await query('SELECT * FROM media_assets ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
