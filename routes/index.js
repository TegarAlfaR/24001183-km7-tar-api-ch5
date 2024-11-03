const router = require("express").Router()

const Cars = require("./carsRouter")
const HealthCheck = require("./healtCheck")
const Auth = require("./authRouter")
const User = require("./usersRouter")
const Doc = require("./documentationRouter")

router.use("/api/v1/health-check", HealthCheck)
router.use("/api/v1/", Auth)
router.use("/api/v1/cars", Cars)
router.use("/api/v1/users", User)

router.use("/api-docs", Doc)

module.exports = router;