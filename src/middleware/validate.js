module.exports = (validator) => {
  return (req, res, next) => {
    if (Object.keys(req.body).length === 0)
      return res.status(400).send({ error: 'No info provided...' });
    const { error } = validator(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    next();
  };
};
