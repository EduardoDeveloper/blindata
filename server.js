var express=require('express'),
    app = express(),
    fs = require('fs'),
    JSZip = require('jszip'),
    Docxtemplater = require('docxtemplater'),
    path = require('path'),
    bodyParser = require('body-parser'),
    busboyBodyParser = require('busboy-body-parser'),
    port = process.env.port || 3000,
    rutaArchivoEntrada=path.resolve(__dirname,'template.docx'),
    rutaArchivoSalida=path.resolve(__dirname,'salida.docx');

app.use(busboyBodyParser());

app.get('/',function(request,response){
    response.send({"mensaje","Hola Mundo"});
});
app.post('/template',function(request,response){
    var doc = new Docxtemplater(),
        archivo=request.files.template;

    fs.writeFileSync(rutaArchivoEntrada,archivo.data);
    var content = fs.readFileSync(rutaArchivoEntrada, 'binary');
    var zip = new JSZip(content);
    doc.loadZip(zip).setOptions({
        nullGetter(part){
            if(!part.module){
                return "N/D";
            }
            if(part.module==="rawxml"){
                return "";
            }
            return "";
        }
    });

    try {
        var datos=JSON.parse(request.body.data);
        var datosJson=JSON.parse(datos);
        doc.setData(datosJson);
        doc.render();
        var buf = doc.getZip().generate({type: 'nodebuffer'});
        fs.writeFileSync(rutaArchivoSalida, buf);
        fs.unlinkSync(rutaArchivoEntrada);
        fs.unlinkSync(rutaArchivoSalida);
        response.send({codigo:200,mensaje:archivo.name,data:buf.toString('base64')});
    }
    catch (error) {
        response.send({codigo:400,mensaje:'Error al crear los documentos',data:null});
    }

});

app.listen(port,function(){
    console.log('servidor express escuchando el puerto '+port);
});


