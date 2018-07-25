var nueva_fecha = new Date();
$(document).ready(function(){

    $('#txt_fecha_libro').val(nueva_fecha.getFullYear()+'/'+(nueva_fecha.getMonth()+1)+'/'+nueva_fecha.getDate());
});

class Libro {
    constructor(titulo, autor, tema, existencia, ubicacion, biblioteca) {
        this.titulo = titulo
        this.autor = autor
        this.tema = tema
        this.existencia = existencia
        this.ubicacion = ubicacion
        this.fecha_ingreso = nueva_fecha.getFullYear()+'-'+(nueva_fecha.getMonth()+1)+'-'+nueva_fecha.getDate()
        this.biblioteca = biblioteca
    }

}

function TemasLista(){
    var opt = new String()
        $.ajax({
            url:'/admins/ctemas/',
            datatype: 'JSON',
            type: 'POST',
            data: {
                    csrfmiddlewaretoken: $('input:hidden[name=csrfmiddlewaretoken]').val()
                  },
            success: (data) => {
                temas = $.parseJSON(data["temas"])
                $.each(temas, (i,v) => {
                    opt+="<option value = "+temas[i]["pk"]+">"+temas[i]["fields"]["tema"]+"</option>";
                });
                $("#slc_tema").html(opt);
            },
            error: (error, e) => {
                console.log(error + " " + e);
            }
        })
}
TemasLista();

function AutoresLista(){
    var opt = new String()
        $.ajax({
            url:'/admins/cautores/',
            datatype: 'JSON',
            type: 'POST',
            data: {
                    csrfmiddlewaretoken: $('input:hidden[name=csrfmiddlewaretoken]').val()
                  },
            success: (data) => {
                autores = $.parseJSON(data["autores"])
                $.each(autores, (i,v) => {
                    opt+="<option value = "+autores[i]["pk"]+">"+autores[i]["fields"]["nombre"]+" "+autores[i]["fields"]["apellido"]+"</option>";
                });
                $("#slc_autor").html(opt);
            },
            error: (error, e) => {
                console.log(error + " " + e);
            }
        })
}
AutoresLista();

function BibliotecaLista(){
    var opt = new String()
        $.ajax({
            url:'/admins/cbibliotecas/',
            datatype: 'JSON',
            type: 'POST',
            data: {
                    csrfmiddlewaretoken: $('input:hidden[name=csrfmiddlewaretoken]').val()
                  },
            success: (data) => {
                bibliotecas = $.parseJSON(data["bibliotecas"])
                $.each(bibliotecas, (i,v) => {
                    opt+="<option value = "+bibliotecas[i]["pk"]+">"+bibliotecas[i]["fields"]["nombre"]+"</option>";
                });
                $("#slc_biblioteca").html(opt);
            },
            error: (error, e) => {
                console.log(error + " " + e);
            }
        })
}
BibliotecaLista()

function LibrosAgregar(){

    var titulo = $("#txt_titulo_libro").val();
    var autor = $("#slc_autor").val();
    var tema = $("#slc_tema").val();
    var existencia = $("#txt_existencia").val();
    var ubicacion = $("#txt_ubicacion").val();
    var fecha_ingreso = $("#txt_fecha_libro").val();
    var biblioteca = $("#slc_biblioteca").val()
    console.log(biblioteca)

    var new_libro = new Libro(
                                titulo,
                                autor,
                                tema,
                                existencia,
                                ubicacion,
                                biblioteca,
                             )

    if(titulo == ""){
        alert("Ingrese el titulo del libro");
        return false;
    }
    if(autor == ""){
        alert("Ingrese el autor del libro");
        return false;
    }
    if(tema == ""){
        alert("Ingrese el tema del libro");
        return false;
    }
    if(existencia == ""){
        alert("Ingrese la cantidad disponible");
        return false;
    }
    if(ubicacion == ""){
        alert("Ingrese la ubicacion del libro");
        return false;
    }
    if(fecha_ingreso == ""){
        alert("Ingrese la fecha de ingreso");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '/admins/libros/agregar/',
        data: new_libro,
        beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => {
                switch (data['status']) {
                    case 0:
                            alert("Agregado correctamente")
                            window.location.href = "/admins/libros/"
                            break
                    case 1:
                            alert("Este administrador ya ha sido registrdo")
                    default:
                            alert("Hay algun problema con el servidor. Intentalo mas tarde")
                }
        },
        error: (error) => {
                alert("Hay algun problema con el servidor. Intentalo mas tarde")
        }
    });


    function SesionCerrar(){
        logedin = false;
        localStorage.removeItem('usernow');
        window.location.href = "login.html";
    }
}
