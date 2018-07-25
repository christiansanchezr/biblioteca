    var libros = 0
    var usuario = localStorage.getItem("usuario")
    var biblioteca = localStorage.getItem("biblioteca")
    //Obtiene el libro que el usuario selecciono. Genera la fecha actual y una fecha despues de 7 dias. Luego crea una pestaña que muestra los datos de ese libro con la opcion de prestar
function Prestar(e) {
    var fecha = new Date;
    var dia = ((fecha.getDate() + 7) > 30)?fecha.getDate() - 30:'';
    var mes1 = ( ( String(fecha.getFullYear())+"-"+((dia == '')?String(fecha.getMonth()+1):String(fecha.getMonth()+2))+"-"+((dia == '')?String(fecha.getDate()+7):String(dia))) ).toString()
    var mes2 = ( String(fecha.getFullYear())+"-"+String((fecha.getMonth()+1))+"-"+ String(fecha.getDate()) ).toString()
    id = $(e).prop("id")
    for (var i = 0; i < libros.length; i++) {
        if (libros[i]["id"] == id) {
            $(".buttons-nav").append("  <div class='pop-prestar'><table><tr class='table-list-title'><td>Clasificacion</td><td>Libro</td></tr><tr class='table-list-element'><td class='table-list-text'>Libro</td><td class='table-list-text'>"+libros[i]["nombre"]+"</td></tr><tr class='table-list-element'><td class='table-list-text'>Autor</td><td class='table-list-text'>"+libros[i]["autor__nombre"]+"</td></tr><tr class='table-list-element'><td class='table-list-text'>Tema</td><td class='table-list-text'>"+libros[i]["tema__tema"]+"</td></tr><tr class='table-list-element'><td class='table-list-text'>Ubicacion</td><td class='table-list-text'>"+libros[i]["ubicacion"]+"</td></tr><tr class='table-list-element'><td class='table-list-text'>Disponibles</td><td class='table-list-text'>"+libros[i]["existencia"]+"</td></tr><tr class='table-list-element'><td class='table-list-text'>Fecha de prestamo</td><td class='table-list-text'>"+fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"</td></tr><tr class='table-list-element'><td class='table-list-text'>Fecha devolucion</td><td class='table-list-text'>"+((dia == '')?fecha.getDate()+7:dia)+"/"+((dia == '')?fecha.getMonth()+1:fecha.getMonth()+2)+"/"+fecha.getFullYear()+"</td></tr></table><div class='col-2'><button class='square-blue' onclick='Cerrarpop();'>Cerrar</button><button class='square-blue' onclick=\"PrestarLibro("+id+",'"+mes2+"','"+mes1+"')\">Prestar</button></div></div>");
        }
    }
}

function Cerrarpop() {
    $(".pop-prestar").remove();
}


//obtiene las fecha generada y el libro. Envia esos datos y el codigo del libro generado.
function PrestarLibro(libro, fp, fe) {
    var codigo = "";
    console.log(fp + "" + fe)
    for (var k = 0; k < 15; k++) {
        codigo+= (Math.floor(Math.random() * (9 - 0))).toString();
    }

    $.ajax({
        type: "POST",
        url: "/user/prestar/",
        data: {
                libro: id,
                usuario: usuario,
                codigo: codigo,
                fecha_prestamo: fp,
                fecha_entrega: fe
                },
        beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => { //si el usuario ya ha prestado mas de 9 veces entonces devuelve un 0, si no un 1.
                switch (data) {
                    case "1":
                            alert("Prestado correctamente")
                            alert("Tu codigo de prestamo es: "+ codigo);

                            window.location.href = "/user/libros/";
                            break
                    case "0":
                            alert("Has alcanzado el maximo de libros prestados o ya no hay libros disponibles")
                            break
                    default:
                            alert("Hay algun problema con el servidor. Intentalo mas tarde")
                }
        },
        error: (error) => {
                console.log(error)
        }
        })
                        

}

$(document).ready(function(){
    //envia el token del usuario para determinar el tipo y asi redirigir si no pertenece a esta pagina
    if (usuario) {
        $.ajax({
            type: 'POST',
            url: '/user/libros/',
            data: {usuario : usuario, biblioteca : biblioteca},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {
                libros = $.parseJSON(data['libros'])
                document.querySelector(".table-list-biblio").textContent = libros[0]["biblioteca__nombre"]

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
    var total_libros = libros.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_libro += "<tr class='table-list-title'>";
    tabla_libro += "<td>#</td>";
    tabla_libro += "<td>Titulo</td>";
    tabla_libro += "<td>Tema</td>";
    tabla_libro += "<td>Disponible</td>";
    tabla_libro += "<td>ubicacion</td>";
    tabla_libro += "<td>Operaciones</td>";
    tabla_libro += "</tr>";
    $.each(libros, function(i, valor){
        if(i >= inferior && i < superior){
            tabla_libro += "<tr class='table-list-element'>";
            tabla_libro += "<td>"+(i+1)+"</td>";
            tabla_libro += "<td class='table-list-text'>"+libros[i]["nombre"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+libros[i]["tema__tema"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+libros[i]["existencia"]+"</td>";
            tabla_libro += "<td class='table-list-text'>"+libros[i]["ubicacion"]+"</td>";
            tabla_libro += "<td><button id="+libros[i]["id"]+" class='round-blue' style='width: 68px; height: 32px; top: 50%; margin-top: 8px;' onclick='Prestar(this);'>Prestar</button></td>";
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


$("#btn_buscar").on("click", function() {
    if ($("#btn_buscar").text() == "Buscar") {
        tabla_libro = "";
        filtro = $("#slc_buscar").val();
        buscar = ($('#txt_search').val()).toLowerCase();
        $.each(libros, function(i, valor) {
            switch (filtro) {
                case "Libro":
                                if ((libros[i]["nombre"]).toLowerCase() == buscar) {
                                    tabla_libro += "<tr class='table-list-element'>";
                                    tabla_libro += "<td>"+(i+1)+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["tema__tema"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["existencia"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["ubicacion"]+"</td>";
                                    tabla_libro += "<td><button id="+libros[i]["id"]+" class='round-blue' style='width: 68px; height: 32px; top: 50%; margin-top: 8px;' onclick='Prestar(this);'>Prestar</button></td>";
                                    tabla_libro += "</tr>";
                                }
                                break;
                case "Tema":
                                if ((libros[i]["tema__tema"]).toLowerCase() == buscar) {
                                    tabla_libro += "<tr class='table-list-element'>";
                                    tabla_libro += "<td>"+(i+1)+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["tema__tema"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["existencia"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["ubicacion"]+"</td>";
                                    tabla_libro += "<td><button id="+libros[i]["id"]+" class='round-blue' style='width: 68px; height: 32px; top: 50%; margin-top: 8px;' onclick='Prestar(this);'>Prestar</button></td>";
                                    tabla_libro += "</tr>";
                                }
                                break;
                case "Ubicacion":
                                if ((libros[i]["ubicacion"]).toLowerCase() == buscar) {
                                    tabla_libro += "<tr class='table-list-element'>";
                                    tabla_libro += "<td>"+(i+1)+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["nombre"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["tema__tema"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["existencia"]+"</td>";
                                    tabla_libro += "<td class='table-list-text'>"+libros[i]["ubicacion"]+"</td>";
                                    tabla_libro += "<td><button id="+libros[i]["id"]+" class='round-blue' style='width: 68px; height: 32px; top: 50%; margin-top: 8px;' onclick='Prestar(this);'>Prestar</button></td>";
                                    tabla_libro += "</tr>";
                                }
                                break;
            }
        });
        $("#table-list").html(tabla_libro);
        $("#btn_buscar").text("Volver");
    }else if ($(this).text() == "Volver"){
        LibrosVer(1);
        $("#btn_buscar").text("Buscar");
    }
});

});
