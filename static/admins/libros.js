var libros = 0;
$(document).ready(function(){
    var usuario = localStorage.getItem("usuario")

    if (usuario) {
        $.ajax({
            type: 'POST',
            url: '/admins/libros/',
            data: {usuario : usuario},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {
                libros = $.parseJSON(data["libros"])
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

function Eliminar(libro) {
  libro = $(libro).prop("id")
  $.ajax({
          type: 'POST',
          url: '/admins/libros/eliminar/',
          data: {libro: libro},
          beforeSend: (xhr) => {
              xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
          },
          success: (data) => {
              switch (data['status']) {
                case 1:
                  alert("Eliminado")
                  window.location.href = "/admins/libros/"
                  break;
                default:
                  alert("Hay algun problema con el servidor. Intentalo mas tarde")
              }
          },
          error: (error) => {
            alert("Hay algun problema de conexion")
          }
        })
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

function editartema(libro) {
    libro = $(libro).prop("id")
    titulo = $("#txt_nombre").val()
    autor = $("#slc_autor").val()
    tema = $("#slc_tema").val()
    biblioteca = $("#slc_biblioteca").val()
    existencia = $("#txt_existencia").val()
    ubicacion = $("#txt_ubicacion").val()
    $.ajax({
        type: 'POST',
        url: '/admins/libros/editar/',
        data: {libro : libro, titulo : titulo, autor : autor, tema: tema, existencia: existencia, ubicacion : ubicacion, biblioteca : biblioteca},
        beforeSend: (xhr) => {
            xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => {
            switch (data) {
              case '0':
                alert("Modificado")
                window.location.href = "/admins/libros/"
                break;
              default:
                alert("Hay algun problema con el servidor. Intentalo mas tarde")
            }
        },
        error: (error) => {
          alert("Hay algun problema de conexion")
        }
      })
}

function editar(libro){
    libro = $(libro).prop("id")
    $.each(libros, function(indice, valor){
        if(libros[indice].id == libro){
            $("body").append("<div class='pop-prestar'><table><tr class='table-list-title'><td>Autor</td></tr><tr class='table-list-element'><td class='table-list-text'>Nombre</td><td><input type='text' id='txt_nombre' value='"+ libros[indice].nombre +"'></td></tr><tr class='table-list-element'><td class='table-list-text'>autor</td><td><select id='slc_autor'></select></td></tr><tr class='table-list-element'><td class='table-list-text'>Tema</td><td><select id='slc_tema'></select></td></tr><tr class='table-list-element'><td class='table-list-text'>Existencia</td><td><input type='text' id='txt_existencia' value='"+ libros[indice].existencia +"'></td></tr><tr class='table-list-element'><td class='table-list-text'>Ubicacion</td><td><input type='text' id='txt_ubicacion' value='"+ libros[indice].ubicacion +"'></td></tr><tr class='table-list-element'><td class='table-list-text'>Biblioteca</td><td><select id='slc_biblioteca'></select></td></tr></table><div class='col-2'><button class='square-blue' onclick='Cerrarpop()'>Cerrar</button><button id="+ libros[indice].id +" onclick='editartema(this)' class='square-blue'>Editar</button></div></div>");
        }
    });
    TemasLista()
    AutoresLista()
    BibliotecaLista()
  }


  function Cerrarpop() {
      $(".pop-prestar").remove();
  }

function LibrosVer(pagina){
    var tabla_libro = "";
    var total_libros = libros.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_libro += "<tr>";
    tabla_libro += "<td>#</td>";
    tabla_libro += "<td>Titulo</td>";
    tabla_libro += "<td>Tema</td>";
    tabla_libro += "<td>Existencia</td>";
    tabla_libro += "<td>Biblioteca</td>";
    tabla_libro += "<td>Operaciones</td>";
    tabla_libro += "</tr>";
    $.each(libros, function(indice, valor){
        if(indice >= inferior && indice < superior){
            tabla_libro += "<tr>";
            tabla_libro += "<td>"+(indice+1)+"</td>";
            tabla_libro += "<td>"+libros[indice].nombre+"</td>";
            tabla_libro += "<td>"+libros[indice].tema__tema+"</td>";
            tabla_libro += "<td>"+libros[indice].existencia+"</td>";
            tabla_libro += "<td>"+libros[indice].biblioteca__nombre+"</td>";
            tabla_libro += "<td><button id="+ libros[indice].id +" onclick='editar(this)' class='button-link'>Editar</button><button id="+ libros[indice].id +" onclick='Eliminar(this)' class='button-link'>Eliminar</button></td>";
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
