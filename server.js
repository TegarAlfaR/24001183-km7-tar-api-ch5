require("dotenv").config()

const express = require("express")
const morgan = require("morgan")

const router = require("./routes")
const notFound = require("./middlewares/notFound")

const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.use("/api/v1", router)
app.use(notFound)

module.exports = app;