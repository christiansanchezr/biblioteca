var usuarios = 0;
$(document).ready(function(){
    var usuario = localStorage.getItem("usuario")

    if (usuario) {
        $.ajax({
            type: 'POST',
            url: '/admins/usuarios/',
            data: {usuario : usuario},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {
                usuarios = $.parseJSON(data["usuarios"])
                return (data['page']!=="#")?window.location.href = data['page']:LibrosVer(1);
            }
        })

    }else{
        window.location.href = "/user/login/";
    }

    $("#btn_logout").on('click',function(){
        localStorage.removeItem("usuario");
        window.location.href = "/user/login/";
    });
});


function LibrosVer(pagina){
    var tabla_libro = "";
    var total_libros = usuarios.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_libro += "<tr>";
    tabla_libro += "<td>#</td>";
    tabla_libro += "<td>Nombre</td>";
    tabla_libro += "<td>Apellido</td>";
    tabla_libro += "<td>Municipio</td>";
    tabla_libro += "<td>Correo</td>";
    tabla_libro += "<td>token</td>";
    tabla_libro += "</tr>";
    $.each(usuarios, function(indice, valor){
        if(indice >= inferior && indice < superior){
            tabla_libro += "<tr>";
            tabla_libro += "<td>"+usuarios[indice].id+"</td>";
            tabla_libro += "<td>"+usuarios[indice].nombre+"</td>";
            tabla_libro += "<td>"+usuarios[indice].apellido+"</td>";
            tabla_libro += "<td>"+usuarios[indice].municipio__nombre+"</td>";
            tabla_libro += "<td>"+usuarios[indice].correo+"</td>";
            tabla_libro += "<td>"+usuarios[indice].usrtkn+"</td>";
            tabla_libro += "</tr>";
        }
    });
    var funcion_anterior = (inferior > 0)?'onclick="LibrosVer('+(pagina-1)+');"':'';
    var boton_anterior = '<button class="square-blue"'+funcion_anterior+'>Anterior</button>';
    var funcion_siguiente = (superior < total_libros)?'onclick="LibrosVer('+(pagina+1)+');"':'';
    var boton_siguiente = '<button class="square-blue"'+funcion_siguiente+'>Siguiente</button>';
    $("#tbl_tabla_libros").html(tabla_libro);
    $('.list-block-footer').html(boton_anterior+boton_siguiente);
}
