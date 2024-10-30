module.exports = async (req, res, next) =>{
    res.status(404).json({
        status: "Failed",
        message: "API not found",
        isSuccess: false,
        data: null,
    })
}