export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Erreur interne du serveur';
  const details = err.details || undefined;
  console.error('[API_ERROR]', err);
  res.status(status).json({ message, details });
};
