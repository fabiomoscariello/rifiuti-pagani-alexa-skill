
  class ParsingUtilClass {
  static getTipologieRifiutiParsed(tipologieRifiutiJson){
      try{
      return tipologieRifiutiJson.map((rifiuto)=>{
            return{
                "id":rifiuto.id,
                "nome":rifiuto.nome,
            }
      });
      }catch(error){
          console.error('errore getTipologieRifiutiParsed', error);
          throw new Error(error.message);
      }
  }
  static getCalendarioRifiutiParsed(calendarioRifiutiJson, tipologieRifiuti){
    return calendarioRifiutiJson.map((giornoCalendario)=>{
        const rifiutiDifferenziati = giornoCalendario.tipoRifiuto.map((rifiuto)=>{
                 const trovaRifiuto=tipologieRifiuti.find((x)=>x.id === rifiuto);
                 return trovaRifiuto.nome;
            })
            return{
                "giorno":giornoCalendario.giorno,
                "tipoRifiuti":rifiutiDifferenziati,
            }
        });
}
}
module.exports = ParsingUtilClass;







