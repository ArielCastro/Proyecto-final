

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
					<td><a href="#">${respuesta[i].Nombre}</a></td>
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

//cargar los archivos propios cuando se logee
$(document).ready(function(){
	cargarCarpetas();
	cargarArchivos();
});

//cargar los archivos propios cuando se de click en mis proyectos
function cargarTodoMisArchivos(){
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

function cargarTodoCompartidos(){
	cargarCarpetasCompartidas();
	cargarArchivosCompartidos();
	
}


