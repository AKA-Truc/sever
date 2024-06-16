const jwt = require('jsonwebtoken');
const express = require('express');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, process.env.SECRET_KEY, (error, decode) => {
            if (error) {
                return res.status(401).json({
                    success: false,
                    message: 'Token không hợp lệ'
                });
            }

            console.log(decode);
            req.user = decode;
            next();
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Token không được cung cấp'
        });
    }
});

module.exports = {
    verifyAccessToken,
};
