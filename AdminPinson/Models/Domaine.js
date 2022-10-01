const mongoose = require("mongoose")

const model1 = mongoose.Schema({
    id : { type:String, required:[true, "Please provide an id"], unique:true },
    domaine : { type:String, required:[true, "Domaine invalide"] },
    codeDomaine : { type:String, required:true, unique:true},
    codeClasse : { type:String, required:true },
})

const model2 = mongoose.Schema({
    id : { type: String, required:true, unique:true },
    sousDomaineTitle : { type:String, required:[true, "Sous domaine invalide"] },
    codeSousDomaine : { type: String, required:true },
    codeDomaine : { type:String, required:true },
})

const schemaDomaine = new mongoose.model("Domaine", model1 )
const schemaSousDomaine = new mongoose.model("SousDomaine", model2)

module.exports = { schemaDomaine, schemaSousDomaine }