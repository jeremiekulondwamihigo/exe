const mongoose = require("mongoose")

let eleve = mongoose.Schema({
    codeEleve : {type:String, required:true},
    classe:{type:String, required:true},
    id: {type:String, required:true},
    active : {type:Boolean, required:true, default:true}
})
let eleves = new mongoose.model("EleveInscrit", eleve)
module.exports = eleves