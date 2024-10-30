const router = require("express").Router()

const controllers = require("../controllers")

router.get('/', controllers.systemController.healthCheck);

module.exports = router;