const { User, Auth } = require("../models")
const bcrypt = require("bcryptjs")

const getUsers = async (req, res) => {
    const { role } = req.user
    try{
        const roleCheck = role.toLowerCase()
        if(roleCheck === 'member'){
            return res.status(403).json({
                status: 'Failed',
                message: 'Access denied',
                isSuccess: false,
                data: null
            })
        }
        const users = await User.findAll({
            order: [['id', 'ASC']]
        })

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
    const userId = req.params.id
    const { id, role } = req.user
    try{
        const roleCheck = role.toLowerCase()
        if (roleCheck === 'member' && id !== userId) {
            return res.status(403).json({
                status: "Failed",
                message: "Access denied: Members can only view their own data",
                isSuccess: false,
                data: null
            });
        }
        
        const user = await User.findByPk(userId)

        if(!user){
            return res.status(404).json({
                status: "Failed",
                message: "User not Found",
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
    const { username, age, address, email, password } = req.body
    const { role: userRole } = req.user

    try{
        const roleCheck = userRole.toLowerCase()
        if(roleCheck === 'member' || roleCheck === 'admin'){
            return res.status(403).json({
                status: 'Failed',
                message: 'Access denied, only superadmin',
                isSuccess: false,
                data: null
            })
        }

        if(!username){
            return res.status(400).json({
                status: "Failed",
                message: "Failed to create user data: username required",
                isSuccess: false,
                data: null
            })
        }else if(!email){
            return res.status(400).json({
                status: "Failed",
                message: "Failed to create user data: email required",
                isSuccess: false,
                data: null
            })
        }else if(!password){
            return res.status(400).json({
                status: "Failed",
                message: "Failed to create user data: password required",
                isSuccess: false,
                data: null
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const adminRole = 'admin'
        const newUser = await User.create(
            {
                username,
                age,
                address,
                role: adminRole,
                auth: {
                    email,
                    password: hashedPassword
                }
            },
            {
                include: {
                    model: Auth,
                    as: 'auth'
                }
            }
        );

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
    const { role } = req.user
    try{
        const roleCheck = role.toLowerCase()
        if(roleCheck === 'member' || roleCheck === 'admin'){
            return res.status(403).json({
                status: 'Failed',
                message: 'Access denied, only superadmin',
                isSuccess: false,
                data: null
            })
        }

        const findUser = await User.findByPk(id)
        if(!findUser){
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
                isSuccess: false,
                data: null,
            });
        }

        await User.update({
            username,
            age,
            address
        },
        {
            where: { id }
        })
        
        const updatedUser = await User.findByPk(id);

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
    const { role } = req.user
    try {
        const roleCheck = role.toLowerCase()
        if(roleCheck === 'member' || roleCheck === 'admin'){
            return res.status(403).json({
                status: 'Failed',
                message: 'Access denied, only superadmin',
                isSuccess: false,
                data: null
            })
        }

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