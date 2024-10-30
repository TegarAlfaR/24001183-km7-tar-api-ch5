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

module.exports = {
    getCars,
}