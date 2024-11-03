const router = require("express").Router()
const swaggerUi  = require("swagger-ui-express")
const swagggerDocument = require("../docs/swagger.json")

router.use("/", swaggerUi.serve)
router.use("/", swaggerUi.setup(swagggerDocument))

module.exports = router