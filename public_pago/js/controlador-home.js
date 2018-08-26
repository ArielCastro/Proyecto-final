
//obtener carpetas propias
function cargarCarpetas(){
	$.ajax({
		url:"/obtener-carpetas",
		dataType:"json",
		success:function(respuesta){
			$("#h1-titulo").html("Mis proyectos");
			$("#tbl-unidad").html("");
			$("#tbl-compartidos").html("");
			$("#tbl-unidad").append(
				`<thead>
				<tr>
				<th scope="col">Nombre</th>
				<th scope="col">Propietario</th>
				<th scope="col">Tamaño</th>
				<th scope="col">Fecha Creación</th>
				<th scope="col">Fecha modificación</th>
				</tr>
			  </thead>
				`
			);
			for(var i=0; i<respuesta.length; i++){
				$("#tbl-unidad").append(
					`
				<tbody>
				  <tr>
					<!-- <th scope="row"></th> -->
					<td><a href="#"><i class="far fa-folder"></i> ${respuesta[i].nombre}</a></td>
					<td>${respuesta[i].propietario}</td>
					<td>${respuesta[i].tamanio} kb</td>
					<td>-</td>
					<td>-</td>
                  </tr>
                  </tbody>`
				);
			}
		}
	});
};

// obtener archivos propios
function cargarArchivos(){
	//Esta funcion se ejecuta cuando la página esta lista
	$.ajax({
		url:"/obtener-archivos",
		dataType:"json",
		success:function(respuesta){
			for(var i=0; i<respuesta.length; i++){
				$("#tbl-unidad").append(
					`
				<tbody>
				  <tr>
					<!-- <th scope="row"></th> -->
					<td><a href="#" onClick="cargarContenidoArchivo(${respuesta[i].id_archivo})"><i class="far fa-file-alt"></i> ${respuesta[i].Nombre}</a></td>
					<td>${respuesta[i].propietario}</td>
					<td>${respuesta[i].tamanio} kb</td>
					<td>${respuesta[i].fecha_creacion}</td>
					<td>${respuesta[i].fecha_modificacion}</td>
                  </tr>
                  </tbody>`
				);
			}
		}
	});
};


//carga el contenido del archivo y lo muestra en el editor de texto
function cargarContenidoArchivo(id_archivo){
	//Esta funcion se ejecuta cuando la página esta lista
	$.ajax({
		url:"/obtener-contenido-archivo",
		method:"GET",
		data:"id_archivo="+id_archivo,
		dataType:"json",
		success:function(respuesta){
			for(var i=0; i<respuesta.length;i++){
					
			//console.log('entro al success de cargarcontenidoArchivo'+respuesta[i].contenido);
			obtenerContenidoArchivo(respuesta[i].id_archivo,respuesta[i].contenido,respuesta[i].nombre,respuesta[i].id_extension);
			}
		}
	});
};

//cargar los archivos propios cuando se logee
$(document).ready(function(){
	cargarCarpetas();
	cargarArchivos();
});

//cargar los archivos propios cuando se de click en mis proyectos
function cargarTodoMisArchivos(){
	$("#editor").hide();
	$("#container").hide();
	$("#div-gestion-archivos").hide();
	cargarCarpetas();
	cargarArchivos();
};

// obtener carpetas compartidos al usuario logueado
function cargarCarpetasCompartidas(){
	console.log('entro al readyr 2 ');
	$.ajax({
		url:"/obtener-carpetas-compartidas",
		dataType:"json",
		success:function(respuesta){
			$("#h1-titulo").html("");
			$("#h1-titulo").html("Compartidos Conmigo");
			$("#tbl-unidad").html("");
			$("#tbl-compartidos").html("");
			$("#tbl-compartidos").append(
				`<thead>
				<tr>
				<th scope="col">Nombre</th>
				<th scope="col">Propietario</th>
				<th scope="col">Tamaño</th>
				<th scope="col">Fecha Creación</th>
				</tr>
			  </thead>
				`
			);
			for(var i=0; i<respuesta.length; i++){
				$("#tbl-compartidos").append(
					`
				<tbody>
				  <tr>
					<!-- <th scope="row"></th> -->
					<td><a href="#"><i class="far fa-folder"></i> ${respuesta[i].nombre}</a></td>
					<td>${respuesta[i].propietario}</td>
					<td>${respuesta[i].tamanio} kb</td>
					<td>${respuesta[i].fecha_compartido}</td>
                  </tr>
                  </tbody>`
				);
			}
		}
	});
};


// obtener archivos compartidos al usuario logueado
function cargarArchivosCompartidos(){
	$.ajax({
		url:"/obtener-archivos-compartidos",
		dataType:"json",
		success:function(respuesta){
			for(var i=0; i<respuesta.length; i++){
				$("#tbl-compartidos").append(
					`
				<tbody>
				  <tr>
					<td><a href="#" onClick="cargarContenidoArchivo(${respuesta[i].id_archivo})"><i class="far fa-file-alt"></i> ${respuesta[i].nombre}</a></td>
					<td>${respuesta[i].propietario}</td>
					<td>${respuesta[i].tamanio} kb</td>
					<td>${respuesta[i].fecha_compartido}</td>
                  </tr>
                  </tbody>`
				);
			}
		}
	});
};

function cargarTodoCompartidos(){
	$("#editor").hide();
	$("#container").hide();
	$("#div-gestion-archivos").hide();
	cargarCarpetasCompartidas();
	cargarArchivosCompartidos();
	
}


//Funcion para utilizar ACE 
function obtenerContenidoArchivo(id_archivo,contenido,nombre,id_extension){
	
	function update(){
		var idoc = document.getElementById('iframe').contentWindow.document;
		idoc.open();
		idoc.write(editor.getValue());
		idoc.close();
	}

	function setupEditor(){
		window.editor = ace.edit("editor");
		editor.setTheme("ace/theme/monokai");

		//elegir la extension del archivo
		if (id_extension == 1) {
			editor.getSession().setMode("ace/mode/html");
		} else if (id_extension == 2) {
				editor.getSession().setMode("ace/mode/javascript");
			}else if (id_extension == 3) {
				editor.getSession().setMode("ace/mode/ccpp");
			}else if(id_extension ==4){
				editor.getSession().setMode("ace/mode/java");
			}else{
				alert('extension no existe')
			};
		

		$("#h1-titulo").html(nombre);
		$("#tbl-unidad").html("");
		$("#tbl-compartidos").html("");
		$("#div-gestion-archivos").show();
		$("#editor").show();
		$("#container").show();
		$("#id-archivo").val(id_archivo);
		//escribimos los datos que tiene el texto
		editor.setValue(contenido,1);

		editor.getSession().on('change', function() {
			update();
		});

		editor.focus();

		editor.setOptions({
			fontSize: "16pt",
			showLineNumbers: true,
			showGutter: true,
			vScrollBarAlwaysVisible:true,
			enableBasicAutocompletion: false, enableLiveAutocompletion: false
		});

		editor.setShowPrintMargin(false);
		editor.setBehavioursEnabled(false);
	}
	setupEditor();
	update();

};

function GuardarContenidoEditado(id_archivo,contenidoEditado) {
	var textoEditado = editor.getValue();
}

//funcion para guardar los cambios del editor
$("#btn-guardar").click(function(){
	console.log("Enviar al servidor: texto editado: " + editor.getValue() + ", id'archivo: " + $("#id-archivo").val());
	var parametros = "textoEditado="+editor.getValue()+ "&" + "idArchivo="+$("#id-archivo").val();
	$.ajax({
		url:"/guadar-cambios-editor",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
			if (respuesta.affectedRows==1){
				alert('Se guardaron todos los cambios')
			}
		}
	});
});

//funcion para compartir archivos
function compartirArchivo(){
	var parametros = "correoCompartir="+ $("#correo-compartir").val() + "&" + "idArchivo="+$("#id-archivo").val();
	$.ajax({
		url:"/compartir-archivos",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
			if (respuesta.affectedRows==1){
				alert('Se compartió el archivo' + $("#correo-compartir").val());
				window.location.href ="home.html";
			}
			console.log(respuesta);
		}
	});
};

//funcion para borrar archivos
$("#btn-borrar").click(function(){
	//alert("Enviar mensaje: " + $("#txta-mensaje").val());
	console.log("Enviar al servidor: correo a compartir " + $("#correo-compartir").val() + ", id'archivo: " + $("#id-archivo").val());
	var parametros = "idArchivo="+$("#id-archivo").val();
	$.ajax({
		url:"/borrar-archivo",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
			if (respuesta.affectedRows==1){
				alert('Se eliminó el archivo');
				window.location.href ="home.html";
			}
			console.log(respuesta);
		}
	});
});

//funcion para crear nuevos archivos
function nuevoArchivo(){
	$.ajax({
		url:"/nuevo-archivo",
		method:"POST",
		data:{
			nombreArchivo: $('#txt-nombre-archivo').val(),
			idExtension: $('#slc-extension').val()
		},
		dataType:"json",
		success:function(respuesta){
			if (respuesta.affectedRows==1){
				alert('Se creo el archivo con el nombre ' + $("#txt-nombre-archivo").val());
				window.location.href ="home.html";
			}
			console.log(respuesta);
		}
	});
};

//Configurar datos personales del usuario
function registrarCambiosDatos(){
	
	$.ajax({
		url: '/registrar-cambios-datos',
		dataType:"json",
		method:"POST",
		data: {
			nuevoNombre: $('#txt-nombre').val(),
			nuevoApellido: $('#txt-apellido').val(),
            nuevoUsuario: $('#txt-usuario').val(),
            nuevoPais: $('#txt-slcpais').val(),
			nuevoCorreo: $('#txt-correo').val(),
			nuevoContrasena: $('#txt-contrasena').val(),
            nuevoDireccion: $('#txt-direccion').val()
		},
		success:function(respuesta){
			//$('#div-following').prepend(obtenerTagFollowings(listaFollowers[i].nombre,listaFollowers[i].imagen,listaFollowers[i].lugar));
			//console.log(respuesta);
			//Alert('Se añadio nuevo Usuario');
			console.log('se añadio nuevo usuario');
		}
	});
	alert('Se realizaron los cambios' )
	window.location.href ="home.html";
	
}

// obtener archivos propios
function obtenerDatosDePrueba(){
	//Esta funcion se ejecuta cuando la página esta lista
	$.ajax({
		url:"/obtener-datos-usuario-modificar",
		dataType:"json",
		success:function(respuesta){
			for(var i=0; i<respuesta.length; i++){
				$("#txt-nombre").append(respuesta[i].nombres);
				$("#txt-apellido").html(respuesta[i].Apellidos);
				$("#txt-usuario").append(respuesta[i].usuario);
				$("#txt-correo").append(respuesta[i].correo);
				$("#txt-direccion").append(respuesta[i].direccion);
				$("#div-dropdown").append(`<a class="dropdown-item" href="#">`+respuesta[i].nombres`</a>` );
			}
		}
	});
};

// evento click para cerrar Sesion
$("#btn-logout").click(function(){
	$.ajax({
		url:"/logout",
		method:"get",
		dataType:"json",
		success:function(respuesta){
			}
	});
	window.location.href ="index.html";
});

