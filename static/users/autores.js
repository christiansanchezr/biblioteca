var autores = 0
var usuario = localStorage.getItem("usuario")

    if (usuario) {
        ///Se envia el tocken del usuario guardado en localstorage y como header se envia el tocken de seguridad
        $.ajax({
            type: 'POST',
            url: '/user/autores/',
            data: {usuario : usuario},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => { ///segun el tocken se devuelven los autores
                autores = $.parseJSON(data['autores'])
                console.log(autores)

                //Si el usuario no es un administrador, entonces lo redirige al login. Si no muestra los libros
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


//obtiene el objecto que se devolvio y recorre cada libro. luego lo muestra uno por uno
function LibrosVer(pagina){
    var tabla_libro = "";
    var total_libros = autores.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_libro += "<tr class='table-list-title'>";
    tabla_libro += "<td>#</td>";
    tabla_libro += "<td>Nombre</td>";
    tabla_libro += "<td>Apellido</td>";
    tabla_libro += "<td>Nacionalidad</td>";
    tabla_libro += "<td>Fecha_ingreso</td>";
    tabla_libro += "<td>Operaciones</td>";
    tabla_libro += "</tr>";
    $.each(autores, function(i, valor){
        if(i >= inferior && i < superior){
            tabla_libro += "<tr class='table-list-element'>";
            tabla_libro += "<td>"+(i+1)+"</td>";
            tabla_libro += "<td class='table-list-text'>"+autores[i]["nombre"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+autores[i]["apellido"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+autores[i]["pais__nombre"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+autores[i]["fecha_ingreso"]+"</td>";
            tabla_libro += "<td><button id="+autores[i]["id"]+" class='round-blue' style='width: 68px; height: 32px; top: 50%; margin-top: 8px;' onclick='Ver(this)'>Ver</button></td>";
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


///busca segun el objecto que se obtuve. segun el filtro muestra el libro que el usuario busca. Al encontarlo el boton buscar cambia a 'volver'
$("#btn_buscar").on("click", function() {
    if ($(this).text() == "Buscar") {
        tabla_libro = "";
        filtro = $("#slc_buscar").val();
        buscar = ($('#txt_search').val()).toLowerCase();
        $.each(autores, function(i, valor) {
            switch (filtro) {
                case "Nombre":
                                if ((autores[i]["nombre"]).toLowerCase() == buscar) {
                                    tabla_libro += "<tr class='table-list-element'>";
                                    tabla_libro += "<td>"+autores[i]["id"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i]["nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i]["apellido"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i]["pais__nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i].ubicacion+"</td>";
                                    tabla_libro += "<td><button id="+autores[i]["id"]+" class='round-blue' style='width: 68px; height: 32px; top: 50%; margin-top: 8px;' onclick='Ver(this)'>Ver</button></td>";
                                    tabla_libro += "</tr>";
                                }
                                break;
                case "Apellido":
                                if ((autores[i]["apellido"]).toLowerCase() == buscar) {
                                    tabla_libro += "<tr class='table-list-element'>";
                                    tabla_libro += "<td>"+autores[i]["id"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i]["nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i]["apellido"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i]["pais__nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i].ubicacion+"</td>";
                                    tabla_libro += "<td><button id="+autores[i]["id"]+" class='round-blue' style='width: 68px; height: 32px; top: 50%; margin-top: 8px;' onclick='Ver(this)'>Ver</button></td>";
                                    tabla_libro += "</tr>";
                                }
                                break;
                case "Libros":
                                if ((autores[i]["nombre"]).toLowerCase() == buscar) {
                                    tabla_libro += "<tr class='table-list-element'>";
                                    tabla_libro += "<td>"+autores[i]["id"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i]["nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i]["apellido"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i]["pais__nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+autores[i].ubicacion+"</td>";
                                    tabla_libro += "<td><button id="+autores[i]["id"]+" class='round-blue' style='width: 68px; height: 32px; top: 50%; margin-top: 8px;' onclick='Ver(this)'>Ver</button></td>";
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

function Cerrarpop() {
    $(".pop-prestar").remove();
}

function Ver(autor){
    autor = $(autor).prop("id")
    $.each(autores, (i,v) => {
        if (autores[i]["pk"] == autor) {
            $("body").append("<div style='height: 212px;' class='pop-prestar'><table><tr class='table-list-title'><td>Tema</td></tr><tr class='table-list-element'><td class='table-list-text'>Nombre</td><td>"+ autores[i]["fields"]["nombre"] +"</td></tr><tr class='table-list-element'><td class='table-list-text'>Apellido</td><td>"+ autores[i]["fields"]["apellido"] +"</td></tr><tr class='table-list-element'><td class='table-list-text'>pais</td><td>"+ autores[i]["fields"]["pais__nombre"] +"</td></tr><tr class='table-list-element'><td class='table-list-text'>Fecha de ingreso</td><td>"+ autores[i]["fields"]["fecha_ingreso"] +"</td></tr></table><div class='col-2'><button class='square-blue' onclick='Cerrarpop()'>Cerrar</button></div></div>");
        }
    });
}