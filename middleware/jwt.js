const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const generateAccessToken = (uid, role) => {
    console.log('Secret Key:', process.env.SECRET_KEY); // Log khóa bí mật
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = currentTime + (5 * 60); // 5 phút
    
    const token = jwt.sign({
        _id: uid,
        role: role,
        exp: expirationTime
    }, process.env.SECRET_KEY);

    return token;
}


const generateRefreshToken = (uid) => {
    return jwt.sign({
        _id: uid,
    }, process.env.SECRET_KEY, {
        expiresIn: '7d'
    });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}
