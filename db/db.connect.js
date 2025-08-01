const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const initializeDatabase = async() => {
  try{
    await mongoose.connect(mongoUri)
    console.log("connected to Database")
  } catch (error){
      console.log("Connection failed", error)
  }
}

module.exports = { initializeDatabase }