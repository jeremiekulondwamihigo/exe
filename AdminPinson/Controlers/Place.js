const modelPlace = require("../Models/Place")
const { isEmpty } = require("../Utils/Functions")


module.exports = {
    Place : (req, res)=>{

        const { valeur, periode } = req.body
        
        for(let i =0; i< valeur.length; i++){
            modelPlace.findOne({
                codeEleve : valeur[i].codeEleve,
            }).then(placeFound =>{
                if(isEmpty(placeFound)){
                    modelPlace.create({
                        [periode] : valeur[i].place, codeEleve : valeur[i].codeEleve
                    }).catch(error=>{
                        console.log(error)
                    })
                }
                if(!isEmpty(placeFound)){
                    modelPlace.findOneAndUpdate({
                        codeEleve : valeur[i].codeEleve,
                    }, {
                        $set:{
                            [periode] : valeur[i].place
                        }
                    }, null, (error, result)=>{
                            if(error){ console.log(error)} 
                    }) 
                }
            })
            
        }   
    }
}