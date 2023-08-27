/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const moment = require('moment');
const tipoRifiutiJson= require('./tipoRifiuti.json');
const calendarioRifiutiJson= require('./calendarioRifiuti.json');
const calendarioRifiutiClass = require('./CalendarioRifiuti')

var calendarioRaccoltaDifferenziata;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        try{
        calendarioRaccoltaDifferenziata = new calendarioRifiutiClass(tipoRifiutiJson,calendarioRifiutiJson);
        const speakOutput = `Benvenuto in Raccolta Differenziata Pagani!. Per conoscere tutte le funzionalità dici Aiuto`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }catch(error){
            console.error('error',error.message);
        }
    }
};

const RispostaGiornoRifiutiIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RispostaGiornoRifiutiIntent';
    },
    handle(handlerInput) {
        try{
        moment.locale('it');
        const repromptText = 'Vuoi chiedermi qualche altro giorno?';
        const receivedInput = handlerInput.requestEnvelope.request.intent.slots.Data.value;
        const giorno= moment(receivedInput).format('dddd').toLowerCase();
        const calendarioRaccoltaRifiuti = calendarioRaccoltaDifferenziata.getCalendarioRifiuti();
        const rifiuti = calendarioRaccoltaRifiuti.find((giornoRaccolta) => {
            return giornoRaccolta.giorno.toLowerCase() === giorno
        }).tipoRifiuti;
        const speakOutput = `${capitalizeFirstLetter(giorno)} si conferisce ${rifiuti.toString()}.`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
        }catch(error){
            console.log('RispostaGiornoRifiutiIntentHandler error', error);
        }
    }
};

const TipoRifiutiGiornoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TipoRifiutiGiornoIntent';
    },
    handle(handlerInput) {
        try{
        const repromptText = 'Vuoi chiedermi qualche altra tipologia di rifiuto?';
        const tipoRifiutiReceived = handlerInput.requestEnvelope.request.intent.slots.TipoRifiuti.value;
        const calendarioRaccoltaRifiuti = calendarioRaccoltaDifferenziata.getCalendarioRifiutiFromTipiRifiuti();
        const reply = calendarioRaccoltaRifiuti.find((tipoGiorni) => tipoGiorni.rifiuto.toLowerCase() === tipoRifiutiReceived).giorni;
        const speakOutput = `${capitalizeFirstLetter(tipoRifiutiReceived)} si conferisce ${reply.toString()}.`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
        }catch(error){
            console.log('RispostaGiornoRifiutiIntentHandler error', error);
        }
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Puoi provare a dire cosa si getta stasera oppure quando si getta un tipo di rifiuto?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Ok,alla prossima!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Mi dispiace, non ho capito bene! Prova a riformulare la frase';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `Hai lanciato ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Spiacente, Ho riscontrato un problema con ciò che mi hai chiesto. Riprova.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RispostaGiornoRifiutiIntentHandler,
        TipoRifiutiGiornoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();