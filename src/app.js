const express = require("express")
const app = express()

//Rotas
// const index = require("./routes/index")
// const FileRoute = require("./routes/FileRoute")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use("/", index)
// app.use("/file", FileRoute)

module.exports = app
