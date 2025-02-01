import { config } from '../config/config.js';
import { redisClient } from '../lib/redis.lib.js';
import UserModel from './../models/users.models.js';
import jwt from 'jsonwebtoken';

// Function to generate tokens
const generateToken = async (userId) => {
    const accessToken = jwt.sign({ userId }, config.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId }, config.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken };
};

// Function to store the refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
    // console.log(`Storing refreshToken for userId: ${userId}`);
    await redisClient.set(
        `refresh_token:${userId}`,
        refreshToken,
        'EX',
        7 * 24 * 60 * 60 // 7 days
    );
};

// Function to set cookies
const setCookies = (res, accessToken, refreshToken) => {
    // console.log('Setting cookies:', { accessToken, refreshToken });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

// Signup Controller
export const signupController = async (req, res, next) => {
    const { email, name, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = await UserModel.create({ name, email, password });

        // Remove the password before sending the response
        const { password: _, ...userWithoutPassword } = newUser._doc;

        const { accessToken, refreshToken } = await generateToken(userWithoutPassword._id);

        // Store refresh token in Redis
        await storeRefreshToken(userWithoutPassword._id, refreshToken);

        // Set cookies
        setCookies(res, accessToken, refreshToken);

        return res.status(201).json({
            user: userWithoutPassword,
            message: 'User created successfully',
        });
    } catch (error) {
        console.error('Error in signupController:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Login Controller
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });

        // Verify user existence and password
        if (user && (await user.comparePassword(password))) {
            // console.log('User logged in:', user);

            const { accessToken, refreshToken } = await generateToken(user._id);

            // Store refresh token in Redis
            await storeRefreshToken(user._id, refreshToken);

            // Set cookies
            setCookies(res, accessToken, refreshToken);

            return res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                message: 'Login successful',
            });
        } else {
            // Invalid credentials
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error in loginController:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

// Logout Controller
export const logoutController = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
            await redisClient.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error in logoutController:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Refresh Token Controller
export const refreshTokenController = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const decodedToken = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
        const storedToken = await redisClient.get(`refresh_token:${decodedToken.userId}`);

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const accessToken = jwt.sign({ userId: decodedToken.userId }, config.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({ message: 'Access token refreshed successfully' });
    } catch (error) {
        console.error('Error in refreshTokenController:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
