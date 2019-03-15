'use strict';
var request = require('request');

function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function dispatch(intentRequest, callback) {
    console.log("inside dispatch");
    
    const sessionAttributes = intentRequest.sessionAttributes;
    var msg_g = '';
    console.log(intentRequest.currentIntent);
    if (intentRequest.currentIntent.name == 'GreetingIntent' && intentRequest.currentIntent.slots.userName) {
        console.log("Inside greeting slot");
        const slots = intentRequest.currentIntent.slots;
        const un = slots.userName;
        msg_g = `Hi ${un}, How can I help you?`;
        callback(close(sessionAttributes, 'Fulfilled', { 'contentType': 'PlainText', 'content': msg_g }));
    }
    else if (intentRequest.currentIntent.name == 'DiningSuggestionIntent' && intentRequest.currentIntent.confirmationStatus == 'Confirmed') {

        console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

        const slots = intentRequest.currentIntent.slots;
        const loc = slots.RestaurantLocation;
        const ct = slots.CuisineType;
        const nump = slots.NumberofPeople;
        const vd = slots.visitDate;
        const vt = slots.visitTime;
        var output_msg;
        request('https://api.yelp.com/v3/businesses/search?location=' + loc + '&term=' + ct + '&limit=5', function(error, response, body) {
            output_msg = "Since you can't decide, I picked ";
            var bus_list = JSON.parse(body).businesses;
            var bus_list_length = bus_list.length;
            var i;
            for (i = 0; i < 5; i++) {
                output_msg += i+1 + '. ' + bus_list[i]['name'] + ",";
            }
            callback(close(sessionAttributes, 'Fulfilled', { 'contentType': 'PlainText', 'content': `Okay, here are the options you can look at ${output_msg}` }));
        }).auth(null, null, true, 'API_KEY');


    }
    else if  (intentRequest.currentIntent.name == 'ThankYouIntent'){
        console.log("inside thanks");
        msg_g = intentRequest.currentIntent.message;
        callback(close(sessionAttributes, 'Fulfilled', { 'contentType': 'PlainText', 'content': msg_g }));
        //callback(close(sessionAttributes, 'Fulfilled', { 'contentType': 'PlainText', 'content': `${msg}` }));
    }

    
}
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    }
    catch (err) {
        callback(err);
    }



};
