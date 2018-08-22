// var express = require("express");
// var app = express();
// //Exponer una carpeta como publica, unicamente para archivos estaticos: .html, imagenes, .css, .js
// app.use(express.static("public"));
// //Crear y levantar el servidor web.
// app.listen(3000);
// console.log("Servidor iniciado");


var express  = require("express");
var bodyParser = require("body-parser");
var session = require("express-session"); 
var mysql = require("mysql");
var app = express();


var credenciales = {
    user:"root",
    password:"",
    port:"3306",
    host:"localhost",
    database:"clouddit"
};

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:"ASDFE$%#%",resave:true, saveUninitialized:true}));

//Verificar si existe una variable de sesion para poner publica la carpeta public admin
var publicFree = express.static("home-free");
var publicPago = express.static("public-pago");
app.use(
    function(peticion,respuesta,next){
        if (peticion.session.correo){
            if (peticion.session.categoria == 1)
                 publicFree(peticion,respuesta,next);
            else if (peticion.session.categoria == 2)
                 publicPago(peticion,respuesta,next);
        }
        else
            return next();
    }
);

///Para agregar seguridad a una ruta especifica:
function verificarAutenticacion(peticion, respuesta, next){
	if(peticion.session.correo)
		return next();
	else
		respuesta.send("ERROR, ACCESO NO AUTORIZADO");
}


//funcion para el login
app.post("/login", function(peticion, respuesta){
    console.log('entro al post login');
    var conexion = mysql.createConnection(credenciales);
    conexion.query(`SELECT a.id_usuario idUsuario,a.nombres nombres, a.Apellidos apellidos,
                           a.usuario usuario,a.correo correo,a.foto_perfil imagen, b.id_categoria categoria 
                    FROM tbl_usuarios a 
                    INNER JOIN tbl_almacenamientos b
                    on(a.id_almacenamiento = b.id_almacenamiento)
                    where a.correo = ? and contrasena = sha1(?)`,
        [peticion.body.correo, peticion.body.contrasena],
        function(err, data, fields){
                if (data.length>0){
                    peticion.session.usuario = data[0].usuario;
                    peticion.session.correo = data[0].correo;
                    peticion.session.idUsuario = data[0].idUsuario;
                    peticion.session.categoria = data[0].categoria
                    console.log(peticion.session.idUsuario);
                    data[0].estatus = 0;
                    respuesta.send(data[0]); 
                    // global.idSessionUsuario = peticion.session.codigoUsuario;
                    // console.log('variable global:' + idSessionUsuario);
                    
                }else{
                    respuesta.send({estatus:1, mensaje: "Login fallido"}); 
                }
            	
         }
    ); 
});


app.listen(3000);
console.log("Servidor iniciado");