const mongoose = require("mongoose")

const schemaAnnee = mongoose.Schema({
    annee : {type:String, required:true},
    active : {type:Boolean, required:true, default:"false"}
})
let valeur = new mongoose.model("Annee", schemaAnnee)
module.exports = valeur