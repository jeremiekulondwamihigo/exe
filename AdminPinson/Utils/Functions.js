module.exports = {
    isEmpty : function(value){
        return(
            value === undefined || value === null || value === "null" ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0)
        )
    },
    generateString : (length)=>{
        const caractere = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let resultat = "";
        let caractereLength = caractere.length;
        for(let i=0; i<length;i++){
            resultat+= caractere.charAt(Math.floor(Math.random()* caractereLength));
        }
        return resultat
    },
}