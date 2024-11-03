const router = require("express").Router()

const controllers = require("../controllers")
const authenticate = require("../middlewares/authenticate")

router.get("/", authenticate,  controllers.userController.getUsers)
router.get("/:id", authenticate, controllers.userController.getUserById)
router.post("/create", authenticate, controllers.userController.createUser)
router.patch("/update/:id", authenticate, controllers.userController.updateUser)
router.delete("/delete/:id", authenticate, controllers.userController.deleteUser)

module.exports = router