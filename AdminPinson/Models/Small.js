const mongoose = require("mongoose")

const model = mongoose.Schema({
    option : { type: String, required:true},
    section : {type:Array, required:false, default:[]}
})

const valeur = new mongoose.model("Option", model)
module.exports = valeur