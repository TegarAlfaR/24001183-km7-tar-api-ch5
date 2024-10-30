const router = require("express").Router()

const Cars = require("./carsRouter")
const HealthCheck = require("./healtCheck")

router.use("/cars", Cars)
router.use("/health-check", HealthCheck)

module.exports = router;