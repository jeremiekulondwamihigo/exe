const mongoose = require("mongoose")

const schemaAnnee = mongoose.Schema({
    id : {type:String, required:true},
    periode : {type:String, required:true}
})
let valeur = new mongoose.model("Periode", schemaAnnee)
module.exports = valeur