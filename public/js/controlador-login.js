//obtener usuario logueado
$("#btn-login").click(function(){
    console.log('entro al btnlogin')
    $.ajax({
        url:"/login",
       data:"correo="+$("#correo").val()+"&contrasena="+$("#contrasena").val(),
        method:"POST",
        dataType:"json",
        success:function(respuesta){
            if (respuesta.estatus ==0 ){
            window.location.href ="home.html";
            //alert("Credenciales correctas");
            //obtenerContactos(respuesta.session.codigoUsuario);    
            }else
                alert("Credenciales incorrectas");
			console.log(respuesta);
			//obtenerUsuarioLogueado();
        }
    });
});

//data:"correo=arielcastromejia@gmail.com&contrasena=asd.456", 