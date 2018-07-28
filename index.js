var express = require("express");
var app = express();
//Exponer una carpeta como publica, unicamente para archivos estaticos: .html, imagenes, .css, .js
app.use(express.static("public"));
//Crear y levantar el servidor web.
app.listen(3000);
console.log("Servidor iniciado");