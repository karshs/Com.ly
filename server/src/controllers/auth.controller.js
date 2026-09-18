const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/generateTokens');


const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password' });
    }

    
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(409).json({ error: 'Email is already registered' });
      }
      return res.status(409).json({ error: 'Username is already taken' });
    }

    
    const verificationToken = crypto.randomBytes(32).toString('hex');

    
    const user = await User.create({
      username,
      email,
      password,
      isVerified: false,
      verificationToken,
    });

    
    res.status(201).json({
      message: 'Account created! Please verify your email using the link or token below.',
      verificationToken,
      verificationUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/verify/${verificationToken}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during signup' });
  }
};


const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

   
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({
      message: 'Email successfully verified! You can now log in.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during verification' });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

   
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    
    if (!user.isVerified) {
      return res.status(403).json({
        error: 'Please verify your email before logging in.',
      });
    }

   
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

   
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during login' });
  }
};


const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    
    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

   
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ error: 'Refresh token is no longer valid' });
    }

    
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);


    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

   
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during token refresh' });
  }
};


const logout = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (incomingRefreshToken) {
      // Find user and clear stored refresh token
      const user = await User.findOne({ refreshToken: incomingRefreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
      }
    }

    
    clearRefreshTokenCookie(res);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during logout' });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide an email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // For security, we don't leak whether an email exists; always respond with success message
    if (!user) {
      return res.status(200).json({
        message: 'If an account exists with that email, a password reset link has been generated.',
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: 'Password reset instructions generated.',
      resetToken, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during forgot password' });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Please provide reset token and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during password reset' });
  }
};


const getMe = async (req, res) => {

  try {

    res.status(200).json({
      user : {
        id : req.user._id,
        username : req.user.username,
        email: req.user.email,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt,
      }
  });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }

};

module.exports = {
  signup,
  verifyEmail,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
