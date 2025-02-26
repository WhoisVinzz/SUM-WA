const apiAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization !== 'Bearer your-secret-token') {
        return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }
    next();
};

module.exports = { apiAuth };
