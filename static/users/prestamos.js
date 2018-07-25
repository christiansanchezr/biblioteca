var usuario = localStorage.getItem("usuario")
var prestamos = 0
var historial = 0

$(document).ready(function() {
if (usuario) {
//envia el token del usuario para obtener sus libros prestado y saber su tipo de usuario
    $.ajax({
        type: 'POST',
        url: '/user/prestamos/',
        data: {usuario : usuario},
        beforeSend: (xhr) => {
            xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => {
            prestamos = $.parseJSON(data['prestamos'])
            historial = $.parseJSON(data['historial'])
            console.log(data)

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

//obtiene el objeto y los recorre. luego los muestra
function LibrosVer(pagina){

    var tabla_libro = "";
    var total_libros = prestamos.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_libro += "<tr class='table-list-title'>";
    tabla_libro += "<td>#</td>";
    tabla_libro += "<td>Titulo</td>";
    tabla_libro += "<td>Autor</td>";
    tabla_libro += "<td>Codigo</td>";
    tabla_libro += "<td>Prestamo</td>";
    tabla_libro += "<td>Entrega</td>";
    tabla_libro += "<td>Estado</td>";
    tabla_libro += "</tr>";
    for (var i = 0; i < prestamos.length; i++){
        if(i >= inferior && i < superior){
            tabla_libro += "<tr class='table-list-element'>";
            tabla_libro += "<td>"+(i+1)+"</td>";
            tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__nombre"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__autor__nombre"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+prestamos[i]["codigo"]+"</td>";
            tabla_libro += "<td class='table-list-text text-center'>"+prestamos[i]["fecha_prestamo"]+"</td>";
            tabla_libro += "<td class='table-list-text text-center'>"+prestamos[i]["fecha_entrega"]+"</td>";
            tabla_libro += "<td class='table-list-text text-center'>"+prestamos[i]["estado"]+"</td>";
            tabla_libro += "</tr>";
        }
    }
    var funcion_anterior = (inferior > 0)?'onclick="LibrosVer('+(pagina-1)+');"':'';
    var boton_anterior = '<button class="square-blue"'+funcion_anterior+'>Anterior</button>';
    var funcion_siguiente = (superior < total_libros)?'onclick="LibrosVer('+(pagina+1)+');"':'';
    var boton_siguiente = '<button class="square-blue"'+funcion_siguiente+'>Siguiente</button>';
    $("#table-list").html(tabla_libro);
    $('.table-list-pages').html(boton_anterior+boton_siguiente);
    HistorialVer(1)
}

function HistorialVer(pagina){
    var tabla_libro = "";
    var total_libros = historial.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_libro += "<tr class='table-list-title'>";
    tabla_libro += "<td>#</td>";
    tabla_libro += "<td>Titulo</td>";
    tabla_libro += "<td>Autor</td>";
    tabla_libro += "<td>Codigo</td>";
    tabla_libro += "<td>Prestamo</td>";
    tabla_libro += "<td>Entrega</td>";
    tabla_libro += "<td>Estado</td>";
    tabla_libro += "</tr>";
    for (var i = 0; i < historial.length; i++){
        if(i >= inferior && i < superior){
            tabla_libro += "<tr class='table-list-element'>";
            tabla_libro += "<td>"+(i+1)+"</td>";
            tabla_libro += "<td class='table-list-text'>"+historial[i]["libro__nombre"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+historial[i]["libro__autor__nombre"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+historial[i]["codigo"]+"</td>";
            tabla_libro += "<td class='table-list-text text-center'>"+historial[i]["fecha_prestamo"]+"</td>";
            tabla_libro += "<td class='table-list-text text-center'>"+historial[i]["fecha_entrega"]+"</td>";
            tabla_libro += "<td class='table-list-text text-center'>"+historial[i]["estado"]+"</td>";
            tabla_libro += "</tr>";
        }
    }
    var funcion_anterior = (inferior > 0)?'onclick="HistorialVer('+(pagina-1)+');"':'';
    var boton_anterior = '<button class="square-blue"'+funcion_anterior+'>Anterior</button>';
    var funcion_siguiente = (superior < total_libros)?'onclick="HistorialVer('+(pagina+1)+');"':'';
    var boton_siguiente = '<button class="square-blue"'+funcion_siguiente+'>Siguiente</button>';
    $("#table-list2").html(tabla_libro);
    $('.table-list-pages2').html(boton_anterior+boton_siguiente);
}

$("#btn_buscar").on("click", function() {
    if ($(this).text() == "Buscar") {
        tabla_libro = "";
        filtro = $("#slc_buscar").val();
        buscar = ($('#txt_search').val()).toLowerCase();
        $.each(prestamos, function(i, valor) {
            switch (filtro) {
                case "Libro":
                                if ((prestamos[i]["libro__nombre"]).toLowerCase() == buscar) {
                                    tabla_libro += "<tr class='table-list-element'>";
                                    tabla_libro += "<td>"+prestamos[i]["id"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__autor__nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__tema__tema"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["fecha_prestamo"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["fecha_entrega"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["estado"]+"</td>";
                                    tabla_libro += "</tr>";
                                }
                                break;
                case "Tema":
                                if ((prestamos[i]["libro__tema__tema"]).toLowerCase() == buscar) {
                                    tabla_libro += "<tr class='table-list-element'>";
                                    tabla_libro += "<td>"+prestamos[i]["id"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__autor__nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__tema__tema"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["fecha_prestamo"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["fecha_entrega"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["estado"]+"</td>";
                                    tabla_libro += "</tr>";
                                }
                                break;
                case "Autor":
                                if ((prestamos[i]["libro__autor__nombre"]).toLowerCase() == buscar) {
                                    tabla_libro += "<tr class='table-list-element'>";
                                    tabla_libro += "<td>"+prestamos[i]["id"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__autor__nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["libro__tema__tema"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["fecha_prestamo"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["fecha_entrega"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+prestamos[i]["estado"]+"</td>";
                                    tabla_libro += "</tr>";
                                }
                                break;
            }
        });
        $("#table-list").html(tabla_libro);
        $(this).text("Volver");
    }else if ($(this).text() == "Volver"){
        LibrosVer(1);
        $(this).text("Buscar");
    }
});

});
