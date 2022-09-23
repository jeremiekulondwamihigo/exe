const mongoose = require("mongoose")

let agentSchema = mongoose.Schema({
    nom : {type:String, required:true, default:""},
    postNom : {type:String, required:true, default:""},
    prenom:{type:String, required:true, default:""},
    sexe:{type:String, required:true},
    permission : {type:Boolean, required: true, default:true},
    id:{type:String, required:true}
})

let agent = new mongoose.model("Agent", agentSchema)
module.exports = agent