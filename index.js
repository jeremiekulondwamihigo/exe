const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const R_create = require("./AdminPinson/Route/create")
const R_Update = require("./AdminPinson/Route/updata")
const R_delete = require("./AdminPinson/Route/delete")
const R_Read = require("./AdminPinson/Route/Read")
const path = require('path')
const twilio = require("twilio")
const accoundID = "ACecfa0fa5f6f77af4d730756ad26d3afa"
const token = "af4ced60eeb0bc244e3af93c44b19f56"
const client = new twilio(accoundID, token)

const server = express()
server.use(cors())

server.use(express.json({limit:'50mb'}))
server.use(bodyParser.urlencoded({limit:'50mb', extended : true }))
server.use(bodyParser.json());

//Definition des fichiers statiques
server.use('/imagesEleves', express.static(path.resolve(__dirname,'AdminPinson/ImagesEleves')));
server.use('/imagesAdmin', express.static(path.resolve(__dirname,'AdminPinson/ImagesAdmin')));

server.use("/pinson/create", R_create)
server.use("/pinson/read", R_Read)
server.use("/pinson/delete", R_delete)
server.use("/pinson/update", R_Update)
const modelCotation = require("./AdminPinson/Models/Cotation")

const CONNECTION_URL = "mongodb://localhost:27017/Bulletin";
//const CONNECTION_URL = "mongodb://localhost:27017/EXERCICE_BULLETIN";

const PORT = process.env.PORT || 8080

mongoose.connect(CONNECTION_URL, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify : false,
     useCreateIndex:true
}) 

server.post("/sms", (req, res)=>{
    const { from, to, body } = req.body
    client.message.create({
        to : `${from}`,
        from : `${to}`,
        body :"What is your group"
    })
    res.end()
})

server.listen(PORT, function(){
    console.log("AdminPinson server running at "+PORT)
})