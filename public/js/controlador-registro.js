
//Registrar un nuevo usuario
function registrarUsuario(){
	
	$.ajax({
		url: '/registrar-usuario',
		dataType:"json",
		method:"POST",
		data: {
			nuevoNombre: $('#txt-nombre').val(),
			nuevoApellido: $('#txt-apellido').val(),
            nuevoUsuario: $('#txt-usuario').val(),
            nuevoPais: $('#txt-slcpais').val(),
            nuevoCorreo: $('#txt-correo').val(),
            nuevoDireccion: $('#txt-direccion').val(),
            nuevoCategoria: $('#id-categoria3').val(),
			nuevoMetodoPago: $('input:radio[name=rbt-metodo-pago]:checked').val(),
			nuevoNombreTarjeta: $('#cc-nombre').val(),
			nuevoContrasena: $('#txt-contrasena').val(),
            nuevoExpiracion: $('#cc-expiracion').val(),
            nuevoNumero: $('#cc-numero').val(),
			nuevoCvv: $('#cc-cvv').val()
		},
		success:function(respuesta){
			//$('#div-following').prepend(obtenerTagFollowings(listaFollowers[i].nombre,listaFollowers[i].imagen,listaFollowers[i].lugar));
			//console.log(respuesta);
			//Alert('Se añadio nuevo Usuario');
		}
	});
	alert('se añadio nuevo usuario');
	
}

//crear un nuevo usuario Free
function registrarUsuarioFree(){
	
	$.ajax({
		url: '/registrar-usuario-free',
		dataType:"json",
		method:"POST",
		data: {
			nuevoNombre: $('#txt-nombre').val(),
			nuevoApellido: $('#txt-apellido').val(),
            nuevoUsuario: $('#txt-usuario').val(),
            nuevoPais: $('#txt-slcpais').val(),
			nuevoCorreo: $('#txt-correo').val(),
			nuevoContrasena: $('#txt-contrasena').val(),
            nuevoDireccion: $('#txt-direccion').val(),
            nuevoCategoria: $('#id-categoria1').val(),
		},
		success:function(respuesta){
			//$('#div-following').prepend(obtenerTagFollowings(listaFollowers[i].nombre,listaFollowers[i].imagen,listaFollowers[i].lugar));
			//console.log(respuesta);
			//Alert('Se añadio nuevo Usuario');
			console.log('se añadio nuevo usuario');
		}
	});
	alert('¡Bienvenido a Clouddit '+ $('#txt-nombre').val() + ' '+ $('#txt-apellido').val() + '!' )
	window.location.href ="login.html";
	
}