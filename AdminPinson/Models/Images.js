const mongoose = require("mongoose")

const schemaImages = mongoose.Schema({
    matricule : {type:String, required:true}, 
    filename : {type:String, required:true},
})
let valeur = new mongoose.model("Image", schemaImages)
module.exports = valeur