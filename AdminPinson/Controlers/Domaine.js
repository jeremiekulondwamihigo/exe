const { schemaDomaine, schemaSousDomaine } = require("../Models/Domaine")
const { isEmpty, generateString  } = require("../Utils/Functions")
const asyncLib = require("async")
const ModelCours = require("../Models/Cours")

module.exports = {
    Ajouter_Domaine : (req, res)=>{
        console.log(req.body)
        try {
            const { id, codeClasse, domaine } = req.body

            if(isEmpty(domaine)){
                return res.status(200).json({
                    "message":"Veuillez précisez le domaine",
                    "error":true
                })
            }
            let domaineUppercase = domaine.toUpperCase()

            asyncLib.waterfall([
                function(done){
                    schemaDomaine.findOne({ codeClasse, domaine : domaineUppercase })
                    .then(domaineFound =>{
                        if(isEmpty(domaineFound)){
                            done(null, domaineFound)
                        }else{
                            return res.status(200).json({
                                "message":"Ce domaine existe deja",
                                "error":true
                            })
                        }
                    }).catch(function(error){
                        return res.status(200).json({
                            "message":"Catch : "+error,
                            "error":true
                        })
                    })
                },
                function(domaineFound, done){
                    schemaDomaine.create({
                        id, codeDomaine : generateString(9), codeClasse, domaine : domaineUppercase
                    }).then(response =>{
                        done(response)
                    }).catch(function(error){
                        return res.status(200).json({
                            "message":"Catch : "+error,
                            "error":true
                        })
                    })
                }
            ], function(response){
                if(response){
                    return res.status(200).json({
                        "message":"Domaine enregistrer",
                        "error":false
                    })
                }else{
                    return res.status(200).json({
                        "message":"Erreur d'enregistrement",
                        "error":true
                    })
                }
            })    

        } catch (error) {
            console.log(error)
        }
    },
    AjouterSousDomaine : (req, res)=>{
        try {
            
            const { sousDomaineTitle, codeDomaine, id } = req.body

            if(isEmpty(sousDomaineTitle)){
                return res.status(200).json({
                    "message":"Sous domaine incorrect",
                    "error":true
                })
            }
            let codeSous = generateString(9);


            asyncLib.waterfall([
                function(done){
                    schemaSousDomaine.findOne({ sousDomaineTitle, codeDomaine }).then(response =>{
                        if(isEmpty(response)){
                            done(null, response)
                        }else{
                            return res.status(200).json({
                                "message":"Ce domaine existe deja",
                                "error":true
                            })
                        }
                    }).catch(function(error){
                        return res.status(200).json({
                            "message":"Catch : "+error,
                            "error":true
                        })
                    })
                }, function(response, done){
                    schemaSousDomaine.create({ id, sousDomaineTitle, codeSousDomaine: codeSous, codeDomaine})
                    .then(sousDomaineCreate =>{
                        done(sousDomaineCreate)
                    }).catch(function(error){
                        
                        return res.status(200).json({
                            "message":"Catch : "+error,
                            "error":true
                        })
                        
                    })
                }
            ], function(sousDomaineCreate){
                if(sousDomaineCreate){
                    return res.status(200).json({
                        "message":"Sous domaine enregistrer",
                        "error":false
                    })
                }else{
                    return res.status(200).json({
                        "message":"Erreur d'enregistrement",
                        "error":true
                    })
                }
            })

        } catch (error) {
            console.log(error)
        }
    },

    readCoursDomaine : (req, res)=>{

        const { codeClasse } = req.params

        let lookSousDomaineOne = {
            $lookup : {
                from : "sousdomaines",
                localField:"codeDomaine",
                foreignField:"codeDomaine",
                as : "sousDomaine"
            }
        }
        let match = { $match : { "codeClasse" : codeClasse }}
        let matchCours = { $match : { "classe" : codeClasse }}
        asyncLib.waterfall([
            function(done){
                schemaDomaine.aggregate([match, lookSousDomaineOne]).then(Domaine_SousDomaine =>{
                    if(Domaine_SousDomaine){
                        done(null, Domaine_SousDomaine)
                    }
                }).catch(function(error){return res.send(error)})
            },
            function(Domaine_SousDomaine, done){
                

                ModelCours.aggregate([ matchCours ]).then(response =>{
                    
                    if(!isEmpty(response)){
                        let data = []; let cours=[]; let data1=[]; let max = 0; let maxGen = 0
                        for(let i=0; i < Domaine_SousDomaine.length; i ++){
                            
                            cours=[]; data1=[]; max=0;

                            if(!isEmpty(Domaine_SousDomaine[i].sousDomaine)){
                                for(let x =0; x < Domaine_SousDomaine[i].sousDomaine.length ; x++){
                                    max=0;
                                    cours = response.filter(a =>a.identifiant === Domaine_SousDomaine[i].sousDomaine[x].codeSousDomaine);
                                    
                                    if(!isEmpty(cours)){
                                        for(let b =0; b < cours.length; b++){
                                            max = max + cours[b].maxima
                                        }
                                    }
                                    maxGen = maxGen + max
                                    data1.push({
                                        "sous": Domaine_SousDomaine[i].sousDomaine[x].sousDomaineTitle,
                                        cours, 'soustotal':max
                                    });
                                }
                            }else{
                                cours = response.filter(b =>b.identifiant === Domaine_SousDomaine[i].codeDomaine)
                                if(!isEmpty(cours)){
                                    for(let b =0; b < cours.length; b++){
                                        max = max + cours[b].maxima
                                    }
                                }
                                maxGen = maxGen + max;
                                data1.push({
                                    cours, 'soustotal':max
                                })
                            }
                            data.push({
                                "domaine":Domaine_SousDomaine[i].domaine,
                                data1,
                            })   
                            
                            max=0;
                        }
                        res.status(200).json({data, maxGen})
                    }
                    //res.send(response)
                })

            }
        ])
    },
    readDomaine : (req, res)=>{
        const { codeClasse } = req.params
        let match = { $match : { codeClasse }}

        let lookSousDomaine = {
            $lookup : {
                from : "sousdomaines",
                localField:"codeDomaine",
                foreignField:"codeDomaine",
                as : "sousDomaine"
            }
        }

        schemaDomaine.aggregate([ match, lookSousDomaine]).then(response =>{
            return res.send(response.reverse())
        })
    },
    readSousDomaine : (req, res)=>{
        const { codeClasse } = req.params
        let match = { $match : { codeClasse }}

        let lookSousDomaine = {
            $lookup : {
                from : "sousdomaines",
                localField:"codeDomaine",
                foreignField:"codeDomaine",
                as : "sousDomaine"
            }
        }

        schemaDomaine.aggregate([ match, lookSousDomaine]).then(response =>{
            let data = []
            for(let i=0; i< response.length; i++){
                data = data.concat(response[i].sousDomaine)
            }
            return res.send(data)
        })


    }
}