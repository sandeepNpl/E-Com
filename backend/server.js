const app = require('./app')
const dotenv = require("dotenv")
const connectDataBase = require('./config/database')
const PORT = process.env.PORT | 4000

// config

dotenv.config({
    path:"backend/config/config.env"
})


// Connect to DataBase 
connectDataBase ()




app.listen(PORT, ()=>{
    console.log(`Server is working on http://localhost:${PORT}`)
})