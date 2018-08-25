
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
				<th scope="col">Fecha Creacion</th>
				<th scope="col">Fecha modificacion</th>
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
					<td><a href="#">${respuesta[i].nombre}</a></td>
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
					<td><a href="#" onClick="cargarContenidoArchivo(${respuesta[i].id_archivo})">${respuesta[i].Nombre}</a></td>
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
			obtenerContenidoArchivo(respuesta[i].id_archivo,respuesta[i].contenido,respuesta[i].nombre);
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
				<th scope="col">Fecha Creacion</th>
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
					<td><a href="#">${respuesta[i].nombre}</a></td>
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
					<td><a href="#" onClick="cargarContenidoArchivo(${respuesta[i].id_archivo})">${respuesta[i].nombre}</a></td>
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

function obtenerContenidoArchivo(id_archivo,contenido,nombre){
	
	function update(){
		var idoc = document.getElementById('iframe').contentWindow.document;
		idoc.open();
		idoc.write(editor.getValue());
		idoc.close();
	}

	function setupEditor(){
		window.editor = ace.edit("editor");
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/html");


		$("#h1-titulo").html(nombre);
		$("#tbl-unidad").html("");
		$("#tbl-compartidos").html("");
		$("#div-gestion-archivos").show();
		$("#editor").show();
		$("#container").show();
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


