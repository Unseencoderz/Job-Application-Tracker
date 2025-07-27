import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Generate a token and send it in a cookie
export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
    // Create token
    const token = generateToken(user._id);

    // Cookie options
    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    // Remove password from output
    const userResponse = user.getPublicProfile();

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            message,
            token,
            user: userResponse
        });
};