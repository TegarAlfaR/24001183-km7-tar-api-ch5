const router = require("express").Router()

const controllers = require("../controllers")
const authenticate = require("../middlewares/authenticate")

router.get("/", authenticate, controllers.carsController.getCars)
router.get("/check-available", authenticate, controllers.carsController.checkAvailability)
router.get("/log", authenticate, controllers.carsController.carsLog)
router.post("/create", authenticate, controllers.carsController.createCar)

router.get("/:id", authenticate, controllers.carsController.getCarById)
router.patch("/update/:id", authenticate, controllers.carsController.updateCar)
router.delete("/delete/:id", authenticate, controllers.carsController.deleteCar)

module.exports = router