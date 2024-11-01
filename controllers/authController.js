const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { Auth, User } = require("../models")
const {JsonWebTokenError} = require("jsonwebtoken")

const register = async (req, res) => {
    const { username, age, address, email, password } = req.body

    try{
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create(
            {
                include: {
                    model: Auth,
                    as: 'auth'
                }
            },
            {
                username,
                age,
                address,
                Auth: { 
                    email,
                    password: hashPassword
                }
            }, 
        );
    }
    catch(error){
        res.status(500).json({
            status: "Failed",
            message: error.message,
            isSuccess: false,
            data: null
        })
    }
}

