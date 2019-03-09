const express= require("express");
const bodyParser = require('body-parser');
const app=express();
const path = require('path');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

var message;

app.post("/chatbot", (req,res, next)=>{
    console.log("Inside the POST method");
    message = "I’m still under development. Please come back later.";
    res.status(200).send({
        success: 'true',
        message: message});
});

app.get("/chatbot", (req,res)=>{
    res.sendFile(path.join(__dirname+'/../public/index.html'));
    console.log("Inside the GET method");
    
});



app.listen(4040);