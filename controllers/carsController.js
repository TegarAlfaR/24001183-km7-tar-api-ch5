const { Car, User } = require("../models")
const { Op } = require("sequelize")

const getCars = async (req, res) =>{
    const { model, brand, license_plate, year, size, page } = req.query
    try{    
        const carsCondition = {}
        if(model) carsCondition.model = {[Op.iLike]: `%${model}%`}
        if(brand) carsCondition.brand = {[Op.iLike]: `%${brand}%`}
        if(license_plate) carsCondition.license_plate = {[Op.iLike]: `%${license_plate}%`}
        if(year) carsCondition.year = year
        carsCondition.deleted_by = { [Op.is]: null };

        const pageSize = parseInt(size) || 10
        const pageNum = parseInt(page) || 1
        const offset = (pageNum - 1) * pageSize

        const totalCount = await Car.count({
            where: carsCondition
        })

        const cars = await Car.findAll(
            {
                where: carsCondition,
                limit: pageSize,
                offset,
                order: [['id', 'ASC']]
            }
        )
        const totalPages = Math.ceil(totalCount / pageSize);

        if(cars.length === 0){
            return res.status(200).json({
                status: "Success",
                message: "No records found",
                isSuccess: true,
                data: cars
            })
        }else{
            res.status(200).json({
                status: "Success",
                message: "Succes get all car data",
                isSuccess: true,
                data: {
                    totalData: totalCount,
                    cars,
                    pagination: {
                        page: pageNum,
                        size: pageSize,
                        totalPages,
                    }
                }
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

const getCarById = async (req, res) =>{
    const id = req.params.id

    try{
        const car = await Car.findOne({
            where: {
                id: id,
                deleted_by: {
                    [Op.is]: null
                }
            }
        });

        if(!car){
            return res.status(404).json({
                status: "Failed",
                message: "Car not found",
                isSuccess: false,
                data: null
            })
        }

        res.status(200).json({
            status: "Success",
            message: "Succes get car data by id",
            isSuccess: true,
            data:{
                car
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

const createCar = async (req, res) =>{
    const { model, brand, license_plate, year} = req.body
    const { id, role } = req.user
    
    try{
        const roleCheck = role.toLowerCase()
        if(roleCheck === 'member' ){
            return res.status(403).json({
                status: 'Failed',
                message: 'Access denied',
                isSuccess: false,
                data: null
            })
        }
        if(!model){
            return res.status(400).json({
                status: "Failed",
                message: "Failed to create car data: model required",
                isSuccess: false,
                data: null
            })
        }else if(!brand){
            return res.status(400).json({
                status: "Failed",
                message: "Failed to create car data: brand required",
                isSuccess: false,
                data: null
            })
        }else if(!license_plate){
            return res.status(400).json({
                status: "Failed",
                message: "Failed to create car data: license_plate required",
                isSuccess: false,
                data: null
            })
        }else if(!year){
            return res.status(400).json({
                status: "Failed",
                message: "Failed to create car data: year required",
                isSuccess: false,
                data: null
            })
        }
        const newCar = await Car.create({
            model,
            brand,
            license_plate,
            year,
            created_by: id
        })

        res.status(201).json({
            status: "Success",
            message: "Success create car data",
            isSuccess: true,
            data: {
                newCar
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

const updateCar = async (req, res) =>{
    const carId = req.params.id
    const { model, brand, license_plate, year, status} = req.body

    const { id, role } = req.user

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

        const car = await Car.findByPk(carId)
        if(!car){
            return res.status(404).json({
                status: "Failed",
                message: "Car not found",
                isSuccess: false,
                data: null,
            });
        }

        await car.update(
            {
            model: model, 
            brand: brand,
            license_plate: license_plate,
            year: year,
            status: status,
            updated_by: id
            },
        )

        res.status(200).json({
            status: "Success",
            message: "Success update car data",
            isSuccess: true,
            data: {
                car
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

const deleteCar = async (req, res) => {
    const carId = req.params.id
    const { id, role } = req.user
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

        const car = await Car.findByPk(carId)

        if(!car){
            return res.status(404).json({
                status: "Failed",
                message: "Car not found",
                isSuccess: false,
                data: null,
            });
        }

        const deleteTime = new Date()

        await car.update({
            deleted_by : id,
            deleted_at : deleteTime
        })

        res.status(200).json({
            status: "Success",
            message: "Success delete car",
            isSuccess: true,
            data: {
                id: car.id,
                model: car.model,
                brand: car.brand,
                deleted_by: id,
                deleted_at: deleteTime
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

const checkAvailability = async (req, res) =>{
    try {
        const car = await Car.findAll({
            where: {
                "status" : "available"
            },
            order: [['id', 'ASC']]
        }
        )

        if(car.length === 0){
            return res.status(200).json({
                status: "Success",
                message: "No cars availability found",
                isSuccess: true,
                data: car
            })
        }else{
            res.status(200).json({
                status: "Success",
                message: "Succes get avilable cars",
                isSuccess: true,
                data: {
                    car
                }
            })
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

const carsLog = async (req, res) => {
    const { role } = req.user
    try {
        const roleCheck = role.toLowerCase()
        if(roleCheck === 'member' ){
            return res.status(403).json({
                status: 'Failed',
                message: 'Access denied',
                isSuccess: false,
                data: null
            })
        }
        const car = await Car.findAll({
            order: [['id', 'ASC']]
        })

        if(car.length === 0){
            return res.status(200).json({
                status: "Success",
                message: "No records found",
                isSuccess: true,
                data: car
            })
        }else{
            res.status(200).json({
                status: "Success",
                message: "Succes get car log data",
                isSuccess: true,
                data: car
            })
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
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    checkAvailability,
    carsLog
}