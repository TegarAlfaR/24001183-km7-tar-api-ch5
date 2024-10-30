const router = require("express").Router()

const controllers = require("../controllers")

router.get("/", controllers.carsController.getCars)
// router.get("/:id", )
// router.post("/", )
// router.patch("/:id", )
// router.delete("/:id", )

module.exports = router