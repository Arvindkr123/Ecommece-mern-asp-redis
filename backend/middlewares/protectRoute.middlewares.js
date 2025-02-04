import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
import UserModel from "../models/users.models.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: 'Unauthorized - No access token provided'
            })
        }
        try {

            const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET)

            const user = await UserModel.findById(decoded?.userId);

            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                })
            }

            req.user = user;
            next();
        } catch (error) {

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Unauthorized - access token expired'
                })
            }

            throw error;

        }
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized - Invalid access token',

        })
    }
}


export const adminRoute = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied - admin only'
            })
        }
    } catch (error) {
        res.status(403).json({
            message: 'Access denied - admin only'
        })
    }
}