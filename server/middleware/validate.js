export const validate = (schema) => async (req, res, next) => {
  try {
    const value = await schema.validateAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    req.validated = value;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Requête invalide', details: error.details?.map((d) => d.message) });
  }
};
