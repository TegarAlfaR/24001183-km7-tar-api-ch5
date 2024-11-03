const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { Auth, User } = require("../models")
const {JsonWebTokenError} = require("jsonwebtoken")

const register = async (req, res) => {
    const { username, age, address, email, password } = req.body

    try{
        if(!username){
            return res.status(400).json({
                status: 'Failed',
                message: 'Failed register: username required',
                isSuccess: false,
                data: null
            })
        }else if(!email){
            return res.status(400).json({
                status: 'Failed',
                message: 'Failed register: email required',
                isSuccess: false,
                data: null
            })
        }else if(!password){
            return res.status(400).json({
                status: 'Failed',
                message: 'Failed register: password required',
                isSuccess: false,
                data: null
            })
        }

        const existingUser = await Auth.findOne({
            where: {email}
        })
        if (existingUser) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Failed register: email already registered',
                isSuccess: false,
                data: null
            });
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create(
            {
                username,
                age,
                address,
                auth: { 
                    email,
                    password: hashPassword
                }
            },
            {
                include: [
                    {
                        model: Auth,
                        as: 'auth'
                    }
                ],
            }
        );

        res.status(201).json({
            status: 'Success',
            message: 'Success register',
            isSuccess: false,
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
        if(!email){
            return res.status(400).json({
                status: 'Failed',
                message: 'Failed to login: email required',
                isSuccess: false,
                data: null
            })
        }else if(!password){
            return res.status(400).json({
                status: 'Failed',
                message: 'Failed to login: password required',
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
            return res.status(401).json({
                status: "Failed",
                messsage: "Email not found",
                isSuccess: false,
                data: null
            })
        }

        if(auth && bcrypt.compareSync(password, auth.password)){
            const token = jwt.sign({
                id: auth.id,
                username: auth.user.username,
                email: auth.email,
                userId: auth.user.id,
                role: auth.user.role
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
        }else {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid password',
                isSuccess: false,
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

const checkToken = async (req, res) => {
    const { id, username, role } = req.user

    try {
        res.status(200).json({
            status: "Success",
            message: "Succes get current user",
            isSuccess: true,
            data: {
                id,
                username,
                role
            }
        })
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
    checkToken
}