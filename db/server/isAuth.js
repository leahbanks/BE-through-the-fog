const isAuth = (req, res, next) => {
    if (req.user) next()
    res.json({loggedIn: false });
}

module.exports = isAuth;