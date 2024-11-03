require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const router = require("./routes")
const notFound = require("./middlewares/notFound")

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use("/", router)
app.use(notFound)

module.exports = app;