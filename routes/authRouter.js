const router = require("express").Router()

const controllers = require("../controllers")
const authhenticate = require("../middlewares/authenticate")

router.post("/register", controllers.authController.register)
router.post("/login", controllers.authController.login)
router.get("/current-user", authhenticate, controllers.authController.checkToken)

module.exports = router