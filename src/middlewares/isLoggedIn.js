export default (req, res, next) => {
    req.user || req.cookies.token ? res.status(401).json({ error: 'You are already logged in'}) : next()
}