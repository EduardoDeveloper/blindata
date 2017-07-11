var express=require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    busboyBodyParser = require('busboy-body-parser'),
    port = process.env.port || 3000;

app.use(busboyBodyParser());
app.get('/',function(request,response){
    response.send({"mensaje":"Hola Mundo"});
});
app.listen(port,function(){
    console.log('servidor express escuchando el puerto '+port);
});


