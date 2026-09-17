const jwt  = require('jsonwebtoken');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};


const setRefreshTokenCookie = (res, refreshToken) => {
    const cookieOptions = {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'strict',
        maxAge : 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

}

const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'strict',

    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    setRefreshTokenCookie,
    clearRefreshTokenCookie,
}
