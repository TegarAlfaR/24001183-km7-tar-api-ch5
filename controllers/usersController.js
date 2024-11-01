const { User } = require("../models")

const getUsers = async (req, res) => {
    try{
        const users = await User.findAll()

        if(users.length === 0){
            return res.status(200).json({
                status: "Success",
                message: "No records found",
                isSuccess: true,
                data: users
            })
        }else{
            res.status(200).json({
                status: "Success",
                message: "Succes get all users data",
                isSuccess: true,
                data: users
            })
        }
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

const getUserById = async (req, res) =>{
    const id = req.params.id
    try{
        const user = await User.findByPk(id)

        if(!user){
            return res.status(404).json({
                status: "Failed",
                message: "Failed get user data by id",
                isSuccess: false,
                data: null
            })
        }

        res.status(200).json({
            status: "Success",
            message: "Succes get user data by id",
            isSuccess: true,
            data:{
                user
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

const createUser = async (req, res) =>{
    const { username, age, address, role } = req.body
    try{
        if(!username || !role){
            return res.status(400).json({
                status: "Failed",
                message: "Failed to create user data: username and role are required",
                isSuccess: false,
                data: null
            })
        }
        const newUser = await User.create({
            username,
            age,
            address,
            role
        })

        res.status(201).json({
            status: "Success",
            message: "Success create user data",
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

const updateUser = async (req, res) =>{
    const id = req.params.id
    const { username, age, address } = req.body
    try{
        const findUser = await User.findByPk(id)
        if(!findUser){
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
                isSuccess: false,
                data: null,
            });
        }

        const updatedUser = await User.update({
            username,
            age,
            address
        })

        res.status(200).json({
            status: "Success",
            message: "Success update user data",
            isSuccess: true,
            data: {
                updatedUser
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

const deleteUser = async (req, res) => {
    const id  = req.params.id
    try {
        const findUser = await User.findByPk(id)
        if(!findUser){
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
                isSuccess: false,
                data: null,
            });
        }

        await User.destroy({
            where: {
                id
            }
        })

        res.status(200).json({
            status: "Success",
            message: "Success delete user",
            isSuccess: true,
            data: null,
        });
    } 
    catch(error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            isSuccess: false,
            data: null
        })
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}