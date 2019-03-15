var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var message;
    console.log("entering the function");
    console.log(event.message);
    var inputs = event.message;

    //Initialize lexRunTime
    var lexruntime = new AWS.LexRuntime();

    var params = {
        botAlias: 'prod',
        botName: 'DiningConciergeBot',
        inputText: inputs,
        userId: 'test'
    };


    message = "before Bot";
    console.log("before");
    lexruntime.postText(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err, "failed");
        }
        else {
            if(data){
            console.log("entering lex");
            console.log(data.message);
            message = data.message;
            context.succeed(message);
            }
            else{
                message="Sorry, can you try that again?";
            }
        }
    });
   
  
};
