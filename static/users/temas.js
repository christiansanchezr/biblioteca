var temas = 0
var usuario = localStorage.getItem("usuario")

    if (usuario) {
        $.ajax({
            type: 'POST',
            url: '/user/temas/',
            data: {usuario : usuario},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {
                temas = $.parseJSON(data['temas'])


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


function LibrosVer(pagina){
    var tabla_libro = "";
    var total_libros = temas.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_libro += "<tr class='table-list-title'>";
    tabla_libro += "<td>#</td>";
    tabla_libro += "<td>tema</td>";
    tabla_libro += "<td>Operaciones</td>";
    tabla_libro += "</tr>";
    $.each(temas, function(i, valor){
        if(i >= inferior && i < superior){
            tabla_libro += "<tr class='table-list-element'>";
            tabla_libro += "<td>"+(i+1)+"</td>";
            tabla_libro += "<td class='table-list-text'>"+temas[i]["fields"]["tema"]+"</td>";
            tabla_libro += "<td><button id="+temas[i]["pk"]+" class='round-blue' style='width: 68px; height: 32px; top: 50%; margin-top: 8px;' onclick='Ver(this)'>Ver</button></td>";
            tabla_libro += "</tr>";
        }
    });
    var funcion_anterior = (inferior > 0)?'onclick="LibrosVer('+(pagina-1)+');"':'';
    var boton_anterior = '<button class="square-blue"'+funcion_anterior+'>Anterior</button>';
    var funcion_siguiente = (superior < total_libros)?'onclick="LibrosVer('+(pagina+1)+');"':'';
    var boton_siguiente = '<button class="square-blue"'+funcion_siguiente+'>Siguiente</button>';
    $("#table-list").html(tabla_libro);
    $('.table-list-pages').html(boton_anterior+boton_siguiente);
}

function Cerrarpop() {
    $(".pop-prestar").remove();
}

function Ver(tema){
    tema = $(tema).prop("id")
    $.each(temas, (i,v) => {
        if (temas[i]["pk"] == tema) {
            $("body").append("<div style='height: 212px;' class='pop-prestar'><table><tr class='table-list-title'><td>Tema</td></tr><tr class='table-list-element'><td class='table-list-text'>Tema</td><td>"+ temas[i]["fields"]["tema"] +"</td></tr><tr class='table-list-element'><td class='table-list-text'>Fecha de ingreso</td><td>"+ temas[i]["fields"]["fecha_ingreso"] +"</td></tr></table><div class='col-2'><button class='square-blue' onclick='Cerrarpop()'>Cerrar</button></div></div>");
        }
    });
}

