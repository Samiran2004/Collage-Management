const JWT = require('jsonwebtoken');
const studentUser = require('../models/userModel');

const authentication = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            res.status(400).send({
                status: "Failed",
                message: "Token not found"
            });
        } else {
            const decodeToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
            let user;
            if (decodeToken.role === 'STUDENT') {
                user = await studentUser.findById(decodeToken._id);
            }
            if (!user) {
                res.status(400).send({
                    status: "Failed",
                    message: "Token is not valid"
                })
            } else {
                req.user = user
                next();
            }
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error"
        })
    }
}

module.exports = authentication;