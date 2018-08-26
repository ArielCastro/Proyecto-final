//Modulos
var express  = require("express");
var bodyParser = require("body-parser");
var session = require("express-session"); 
var mysql = require("mysql");
var app = express();
var fs = require("fs");

//Credenciales Base de datos
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
var publicFree = express.static("public_free");
var publicPago = express.static("public_pago");
app.use(
    function(peticion,respuesta,next){
        console.log('entro a la seleccion de home');
        
        if (peticion.session.correo){
            if (peticion.session.categoria == 1)
                 publicFree(peticion,respuesta,next);
            else if (peticion.session.categoria == 2)
                 publicPago(peticion,respuesta,next);
            else if (peticion.session.categoria == 3){
                console.log('entro al if');
                 publicPago(peticion,respuesta,next);
                }
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
                    peticion.session.categoria = data[0].categoria;
                    console.log('Codigo del usuario:' +peticion.session.idUsuario);
                    console.log('Codigo de la categoria:' +peticion.session.categoria);
                    data[0].estatus = 0;
                    respuesta.send(data[0]); 
                    
                }else{
                    respuesta.send({estatus:1, mensaje: "Login fallido"}); 
                }
            	
         }
    ); 
});


//funcion para obtener los archivos del usuario logueado
app.get("/obtener-archivos", function(request, response){
    
    var conexion = mysql.createConnection(credenciales);
    var sql = `SELECT a.nombre_archivo Nombre, b.usuario propietario,a.tamanio tamanio, DATE_FORMAT(a.fecha_creacion,'%d/ %m/ %Y , %h:%i %p') fecha_creacion,
              DATE_FORMAT(a.fecha_modificacion,'%d/ %m/ %Y , %h:%i %p') fecha_modificacion, a.contenido contenido, a.id_archivo id_archivo
                FROM tbl_archivos a 
                INNER JOIN tbl_usuarios b
                on(a.id_usuario = b.id_usuario)
                WHERE a.id_usuario = `+request.session.idUsuario;
    console.log(sql);
    
    var archivos = [];
    conexion.query(sql)
    .on("result", function(resultado){
        archivos.push(resultado);
    })
    .on("end",function(){
        response.send(archivos);
        console.log(archivos);
        
    });   
});

//funcion para obtener las carpetas del usuario logueado
app.get("/obtener-carpetas", function(request, response){
    
    var conexion = mysql.createConnection(credenciales);
    var sql = `SELECT a.nombre_carpeta nombre, b.usuario propietario,a.tamanio tamanio
                FROM tbl_carpetas a 
                INNER JOIN tbl_usuarios b
                on(a.id_usuaurio = b.id_usuario)
                WHERE a.id_usuaurio = `+request.session.idUsuario;
    console.log(sql);
    
    var archivos = [];
    conexion.query(sql)
    .on("result", function(resultado){
        archivos.push(resultado);
    })
    .on("end",function(){
        response.send(archivos);
        console.log(archivos);
        
    });   
});

//funcion para obtener los archivos del usuario logueado compartidos
app.get("/obtener-archivos-compartidos", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = `SELECT c.nombre_archivo nombre, (SELECT usuario from tbl_usuarios where id_usuario = b.id_usuario_comparte) propietario, 
                c.tamanio tamanio, DATE_FORMAT(b.fecha_compartido,'%d/ %m/ %Y , %h:%i %p') fecha_compartido, c.id_archivo id_archivo
                FROM tbl_usuarios a
                INNER JOIN tbl_usuarios_x_archivos b
                on(a.id_usuario = b.id_usuario_recibe)
                INNER JOIN tbl_archivos c
                on(b.id_archivo = c.id_archivo)
                where a.id_usuario =`+request.session.idUsuario;
    
    var archivos = [];
    conexion.query(sql)
    .on("result", function(resultado){
        archivos.push(resultado);
    })
    .on("end",function(){
        response.send(archivos);
        
    });   
});

//funcion para obtener los archivos del usuario logueado compartidos
app.get("/obtener-carpetas-compartidas", function(request, response){  
    var conexion = mysql.createConnection(credenciales);
    var sql = `SELECT c.nombre_carpeta nombre, (SELECT usuario from tbl_usuarios where id_usuario = b.id_usuario_comparte) propietario,						
                c.tamanio tamanio ,DATE_FORMAT(b.fecha_compartido,'%d/ %m/ %Y , %h:%i %p') fecha_compartido
                FROM tbl_usuarios a
                INNER JOIN tbl_usuarios_x_carpetas b
                on(a.id_usuario = b.id_usuario_recibe)
                INNER JOIN tbl_carpetas c
                on(b.id_carpeta = c.id_carpeta)
                where a.id_usuario =`+request.session.idUsuario;
    var archivos = [];
    conexion.query(sql)
    .on("result", function(resultado){
        archivos.push(resultado);
    })
    .on("end",function(){
        response.send(archivos);
        console.log(archivos);
        
    });   
});


//obtiene los datos del archivo
app.get("/obtener-contenido-archivo",function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql =   `SELECT nombre_archivo nombre,id_archivo id_archivo ,contenido contenido, id_extension
                 FROM tbl_archivos WHERE id_archivo = ?;`;
    var contenidoArchivo = [];
    conexion.query(sql, 
                    [
                        request.query.id_archivo   
                    ])
    .on("result", function(resultado){
        contenidoArchivo.push(resultado);
    })
    .on("end",function(){
        response.send(contenidoArchivo);
    });
});


//post para guardar los datos realizados con el editor
app.post("/guadar-cambios-editor", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = `UPDATE tbl_archivos SET contenido = ? WHERE id_archivo = ?;`;
    
    conexion.query(
        sql,
        [request.body.textoEditado, request.body.idArchivo],
        function(err, result){
            if (err) throw err;
            response.send(result);
        }
    ); 
});

//post para guardar los archivos compartidos
app.post("/compartir-archivos", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = ` INSERT INTO tbl_usuarios_x_archivos(id_archivo, id_nivel_acceso, id_usuario_comparte, id_usuario_recibe, fecha_compartido)
                VALUES (?,1,?,(SELECT id_usuario from tbl_usuarios WHERE correo = ?),now())`;
    
    conexion.query(
        sql,
        [request.body.idArchivo, request.session.idUsuario, request.body.correoCompartir],
        function(err, result){
            if (err) throw err;
            response.send(result);
        }
    ); 
});

//post para borrar el archivo abierto
app.post("/borrar-archivo", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = ` DELETE FROM tbl_archivos WHERE id_archivo = ?`;
    
    conexion.query(
        sql,
        [request.body.idArchivo],
        function(err, result){
            if (err) throw err;
            response.send(result);
        }
    ); 
});

//post para guardar un nuevo archivo
app.post("/nuevo-archivo", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = ` INSERT INTO tbl_archivos (id_archivo, id_usuario, id_extension, id_estado_destacado, 
                id_estado_compartido, nombre_archivo, tamanio, fecha_creacion, fecha_modificacion,contenido) 
                VALUES (NULL, ?, ?, 1, 1, ?, 1, now(), now(),' ')`;
    
    conexion.query(
        sql,
        [request.session.idUsuario,request.body.idExtension, request.body.nombreArchivo],
        function(err, result){
            if (err) throw err;
            response.send(result);
        }
    ); 
    console.log(sql);
});

// post para registrar un nuevo usuario premium
app.post("/registrar-usuario", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    const { nuevoNombre, nuevoApellido, nuevoUsuario, nuevoPais,nuevoCorreo,nuevoContrasena,
        nuevoDireccion,nuevoCategoria,nuevoMetodoPago,nuevoExpiracion,nuevoNumero,nuevoCvv,nuevoNombreTarjeta} = request.body;
    const sqlregistrarAlmacenamiento = `INSERT INTO tbl_almacenamientos (id_almacenamiento, id_categoria, espacio_libre, espacio_usado) 
                                        VALUES (NULL, ?, '50', '0')`;
    conexion.query(sqlregistrarAlmacenamiento, [nuevoCategoria], function(errorInsert, dataInsert){
		if (errorInsert) 
			throw errorInsert;
            else{
                if (dataInsert.affectedRows==1){
                    const sqlregistrarPagoxAlmacenamiento = `INSERT INTO tbl_pagos_x_almacenamiento (id_pago_x_almacenamiento,
                        id_almacenamiento, id_categoria_pagar, fecha_transaccion, total_pago) 
                        VALUES (NULL, ?, ?, '2018-08-21 00:00:00', '27')`;
                    conexion.query(sqlregistrarPagoxAlmacenamiento, [dataInsert.id_almacenamiento,nuevoCategoria], function(errorInsert, dataInsert){
                    if (errorInsert) 
                        throw errorInsert;
                    else{
                        if (dataInsert.affectedRows==1){
                            const sqlregistrarPagoTarjeta = `INSERT INTO tbl_pagos_tarjeta (id_pago_x_almacenamiento, id_metodo_pago, nombre_tarjeta,
                                                             numero_tarjeta, fecha_expiracion, CCV) 
                                                             VALUES (?,?,?,?,?,?)`;
                            conexion.query(sqlregistrarPagoTarjeta, [dataInsert.id_pago_x_almacenamiento,nuevoMetodoPago,nuevoNombreTarjeta,
                                                                     nuevoNumero,nuevoExpiracion,nuevoCvv], function(errorInsert, dataInsert){
                            if (errorInsert) 
                                throw errorInsert;
                            else{
                                if (dataInsert.affectedRows==1){
                                    const sqlregistrarUsuario = `INSERT INTO tbl_usuarios (id_usuario, id_almacenamiento, nombres, Apellidos, usuario, correo,
                                                                                             contrasena, foto_perfil, direccion, Pais) 
                                                                 VALUES (NULL,(SELECT  id_almacenamiento FROM tbl_pagos_x_almacenamiento WHERE id_pago_x_almacenamiento = `+dataInsert.id_pago_x_almacenamiento+ `),
                                                                         ,?,?,?,?, sha1(?), 'img/profile-pics/ariel.jpeg', ?, ?)`;
                                    conexion.query(sqlregistrarUsuario, [nuevoNombre,nuevoApellido,
                                                                             nuevoUsuario,nuevoCorreo,nuevoContrasena,nuevoDireccion,nuevoPais], function(errorInsert, dataInsert){
                                    if (errorInsert) 
                                        throw errorInsert;
                                    else{
                                        console.log('exito :D');
                                    }
                                    });
                                }
                            }
                            });
                        }
                    }
                 });
                }
            }
    });

});

// post para registrar un nuevo usuario free
app.post("/registrar-usuario-free", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    const { nuevoNombre, nuevoApellido, nuevoUsuario, nuevoPais,nuevoCorreo,nuevoContrasena,
        nuevoDireccion,nuevoCategoria} = request.body;
    const sqlregistrarAlmacenamiento = `INSERT INTO tbl_almacenamientos (id_almacenamiento, id_categoria, espacio_libre, espacio_usado) 
                                        VALUES (NULL, ?, '50', '0')`;
    conexion.query(sqlregistrarAlmacenamiento, [nuevoCategoria], function(errorInsert, dataInsert){
		if (errorInsert) 
			throw errorInsert;
            else{
                    const sqlregistrarUsuario = `INSERT INTO tbl_usuarios (id_usuario, id_almacenamiento, nombres, Apellidos, usuario, correo,
                        contrasena, foto_perfil, direccion, Pais) 
                        VALUES (NULL,(select id_almacenamiento from tbl_almacenamientos order by id_almacenamiento DESC limit 1),
                        ?,?,?,?, sha1(?), 'img/profile-pics/ariel.jpeg', ?, ?)`;
                    conexion.query(sqlregistrarUsuario, [nuevoNombre,nuevoApellido,
                                                             nuevoUsuario,nuevoCorreo,nuevoContrasena,nuevoDireccion,nuevoPais], function(errorInsert, dataInsert){
                    if (errorInsert) 
                        throw errorInsert;
                    });
                

            }
    });

});

// post para registrar un nuevo usuario free
app.post("/registrar-cambios-datos", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    const { nuevoNombre, nuevoApellido, nuevoUsuario, nuevoPais,nuevoCorreo,nuevoContrasena,
        nuevoDireccion} = request.body;
    const sqlregistrarCambiosUsuario = `UPDATE tbl_usuarios SET nombres=?,Apellidos=?,usuario=?,
                                        correo=?,contrasena=sha1(?),direccion=?,
                                        Pais=? 
                                        WHERE id_usuario = ?`;
    conexion.query(sqlregistrarCambiosUsuario, [nuevoNombre,nuevoApellido,nuevoUsuario,
                                                nuevoCorreo,nuevoContrasena,nuevoDireccion,nuevoPais,request.session.idUsuario], function(errorInsert, dataInsert){
		if (errorInsert) 
			throw errorInsert;
            else{
                console.log('se cambiaron datos');
            }
    });

});

//funcion para obtener los datos del usuario antes de modificarlos
app.get("/obtener-datos-usuario-modificar", function(request, response){
    
    var conexion = mysql.createConnection(credenciales);
    var sql = `SELECT nombres, Apellidos, usuario, correo, Pais , direccion
              FROM tbl_usuarios WHERE id_usuario =`+request.session.idUsuario;
    
    var datosUsuario = [];
    conexion.query(sql)
    .on("result", function(resultado){
        datosUsuario.push(resultado);
    })
    .on("end",function(){
        response.send(datosUsuario);
        console.log( 'datos del usuario: ' + datosUsuario[0].nombres);
        
    });   
});

//Get para cerrar Sesion
app.get("/logout",function(peticion, respuesta){
	peticion.session.destroy();
});


app.listen(3000);
console.log("Servidor iniciado");