const jwt = require("jsonwebtoken")
const { User } = require ("../models")

module.exports = async (req, res, next) => {
    const bearerToken = req.headers.authorization
    
    if(!bearerToken){
        return res.status(401).json({
            status: "Failed",
            message: "Token is missing",
            data: null
        })
    }
    
    try {

        const token = bearerToken.split("Bearer ")[1]

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(payload.userId)

        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
                isSuccess: false,
                data: null
            });
        }

        req.user = user
        next()
        
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                status: "Failed",
                message: "Invalid token",
                isSuccess: false,
                data: null
            });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status: "Failed",
                message: "Token has expired",
                isSuccess: false,
                data: null
            });
        }
        
        res.status(500).json({
            status: "Failed",
            message: error.message,
            isSuccess: false,
            data: null
        })
    }
}