const Helpers = require('../helpers/functions')
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({ status: 401, message: 'Unauthorized Request' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, resp) => {
        console.log(err)
        if (err) {
            return res.status(401).json({ status: 401, message: 'Unauthorized Request' });
        }
        else {
            let user = Helpers.getUserData();
            if (user.type == 'admin' || user.type == 'sub-admin') {
                req.user = resp;
                next();
            }
            else {
                return res.status(401).json({ status: 401, message: 'Unauthorized Request' });
            }
        }
    })
}

module.exports = authenticateToken;