const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { Auth, User } = require("../models")
const {JsonWebTokenError} = require("jsonwebtoken")

const register = async (req, res) => {
    const { username, age, address, email, password } = req.body

    try{
        const hashPassword = await bcrypt.hash(password, 10)

        if(!username || !email || !password){
            return res.status(400).json({
                status: 'Failed',
                message: 'Failed register: username, email, and password are required',
                isSuccess: false,
                data: null
            })
        }

        const newUser = await User.create({
                username,
                age,
                address,
                auth: { 
                    email,
                    password: hashPassword
                }
        },
        {
            include:{
                model: Auth,
                as: 'auth'
            }
        });

        res.status(201).json({
            status: 'Success',
            message: 'Success register',
            isSuccess: true,
            data: {
                newUser
            }
        })

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

const login = async (req, res, next) => {
    const { email, password } = req.body

    try {
        if(!email || !password){
            return res.status(400).json({
                status: 'Failed',
                message: 'Failed to login: email and password are required',
                isSuccess: false,
                data: null
            })
        }
        
        const auth = await Auth.findOne({
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ],
            where: {
                email
            }
        })

        if(!auth){
            return res.status(404).json({
                status: "Failed",
                messsage: "Email not registered",
                isSuccess: false,
                data: null
            })
        }

        if(auth && bcrypt.compareSync(password, auth.password)){
            const token = jwt.sign({
                id: auth.id,
                username: auth.user.username,
                email: auth.email,
                userId: auth.user.id
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRED
            }
            )

            res.status(200).json({
                status: 'Success',
                message: 'Succes login',
                isSuccess: true,
                data: {
                    username: auth.user.username,
                    token
                }
            })
        }else{
            res.status(401).json({
                status: "Failed",
                message: "Password incorrect",
                isSuccess: true,
                data: null
            });
        }

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            isSuccess: false,
            data: null
        })
    }
}

module.exports = {
    register,
    login,

}