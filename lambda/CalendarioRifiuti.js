const parsingUtil = require('./parsingUtil')

var CalendarioRifiutiClass = function(tipologieRifiutiJson, calendarioRifiutiJson){
    try{
    this.tipologieRifiutiJson = tipologieRifiutiJson;
    this.calendarioRifiutiJson = calendarioRifiutiJson;
    this.tipologieRifiutiParsed = parsingUtil.getTipologieRifiutiParsed(this.tipologieRifiutiJson);
    this.calendarioRifiutiParsed = parsingUtil.getCalendarioRifiutiParsed(this.calendarioRifiutiJson, this.tipologieRifiutiParsed)
    }catch(error){
        console.error('CalendarioRifiutiClass error', error);
        throw new Error(error.message);
    }
  }
  
  CalendarioRifiutiClass.prototype.getCalendarioRifiuti= function(){
      return this.calendarioRifiutiParsed;
  }
module.exports = CalendarioRifiutiClass;