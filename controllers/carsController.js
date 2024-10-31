const { Car } = require("../models")

const getCars = async (req, res) =>{
    try{
        const cars = await Car.findAll()
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
                message: "Succes get all data",
                isSuccess: true,
                data: cars
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
        const car = await Car.findByPk(id)

        if(!car){
            return res.status(404).json({
                status: "Failed",
                message: "Failed get car data by id",
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
    const { model, brand, license_plate, year, created_by } = req.body

    try{
        if(!model || !brand || !license_plate || !year || !created_by){
            return res.status(400).json({
                status: "Failed",
                message: "Failed to create car data: missing required fields",
                isSuccess: false,
                data: null
            })
        }
        const newCar = await Car.create({
            model,
            brand,
            license_plate,
            year,
            created_by
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
    const id = req.params.id
    const { model, brand, license_plate, year, updated_by } = req.body
    try{
        const findCar = await Car.findByPk(id)

        if(!findCar){
            res.status(404).json({
                status: "Failed",
                message: "Car not found",
                isSuccess: false,
                data: null,
            });
        }

        const updatedCar = await Car.update({
            model, 
            brand,
            license_plate,
            year,
            updated_by
        })

        res.status(200).json({
            status: "Success",
            message: "Success update car data",
            isSuccess: true,
            data: {
                updatedCar
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
    const userId = req.user.id
    try{
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
            deleted_by : userId,
            deleted_at : deleteTime
        })

        res.status(200).json({
            status: "Success",
            message: "Success delete car",
            isSuccess: true,
            data: {
                id: car.id,
                model: car.model,
                deleted_by: userId,
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

module.exports = {
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
}