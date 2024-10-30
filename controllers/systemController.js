const healthCheck = async (req, res) =>{
    try{
        res.status(200).json({
            status: "Success",
            message: "Succces passed health check",
            isSuccess: true,
            data: null
        })
    }
    catch(error){
        res.status(500).json({
            status: "Failed",
            message: "Failed passed health check",
            isSuccess: false,
            data: null
        })
    }
}

module.exports = {
    healthCheck
}