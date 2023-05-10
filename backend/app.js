
const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();


const errorHandler = require("./middleware/Error")


app.use(express.json())
app.use(cookieParser())
// Route Imports 

const product = require("./routes/productRoute");
const user = require("./routes/userRoute")

const { json } = require('body-parser');

app.use("/api/v1", product)
app.use("/api/v1",user)

// Middleware For Error 
app.use(errorHandler)


module.exports = app