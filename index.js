const express = require('express') ;
const cors = require('cors') ;
require('dotenv').config()

const app = express() ;
const port = process.env.PORT || 3000 ;

//-----------------MiddleWire-------------------------
app.use(cors()) ;
app.use(express.json()) ;

//-------------------Test Api------------------------
app.get('/' , (req,res)=>{
    res.send("Placio Server Api! ")
})



app.listen(port , ()=>{
    console.log(`Sever is Running on port : ${port}`)
})