var autores = 0;
$(document).ready(function(){
    var usuario = localStorage.getItem("usuario")

    if (usuario) {
        $.ajax({
            type: 'POST',
            url: '/admins/autores/',
            data: {usuario : usuario},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {
                autores = $.parseJSON(data["autores"])
                return (data['page']!=="#")?window.location.href = data['page']:AutoresVer(1);
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

function Eliminar(autor) {
  autor = $(autor).prop("id")
  $.ajax({
          type: 'POST',
          url: '/admins/autores/eliminar/',
          data: {autor: autor},
          beforeSend: (xhr) => {
              xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
          },
          success: (data) => {
              switch (data['status']) {
                case 1:
                  alert("Eliminado")
                  window.location.href = "/admins/autores/"
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

function PaisesVer(){
    var opt = new String()
        $.ajax({
            url:'/admins/paises/',
            datatype: 'JSON',
            type: 'POST',
            data: {
                    csrfmiddlewaretoken: $('input:hidden[name=csrfmiddlewaretoken]').val()
                  },
            success: (data) => {
                paises = $.parseJSON(data["paises"])
                $.each(paises, (i,v) => {
                    opt+="<option value = "+paises[i]["pk"]+">"+paises[i]["fields"]["nombre"]+"</option>";
                });
                $("#slc_pais").html(opt);
            },
            error: (error, e) => {
                console.log(error + " " + e);
            }
        })
}

function editartema(autor) {
    autor = $(autor).prop("id")
    nombre = $("#txt_nombre").val()
    apellido = $("#txt_apellido").val()
    pais = $("#slc_pais").val()
    nacimiento = $("#txt_nacimiento").val()
    fallecimiento = $("#txt_fallecimiento").val()
    $.ajax({
        type: 'POST',
        url: '/admins/autores/editar/',
        data: {autor: autor, nombre : nombre, apellido : apellido, pais : pais, nacimiento : nacimiento, fallecimiento : fallecimiento},
        beforeSend: (xhr) => {
            xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => {
            switch (data) {
              case '0':
                alert("Modificado")
                window.location.href = "/admins/autores/"
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

function editar(autor){
    autor = $(autor).prop("id")
    $.each(autores, function(indice, valor){
        if(autores[indice].id == autor){
            $("body").append("<div class='pop-prestar'><table><tr class='table-list-title'><td>Autor</td></tr><tr class='table-list-element'><td class='table-list-text'>Nombre</td><td><input type='text' id='txt_nombre' value='"+ autores[indice].nombre +"'></td></tr><tr class='table-list-element'><td class='table-list-text'>Apellido</td><td><input type='text' id='txt_apellido' value='"+ autores[indice].apellido +"'></td><tr class='table-list-element'><td class='table-list-text'>Pais</td><td><select id='slc_pais'></select></td></tr><tr class='table-list-element'><td class='table-list-text'>Nacimiento</td><td><input type='text' id='txt_nacimiento' value='"+ autores[indice].nacimiento +"'></td></tr><tr class='table-list-element'><td class='table-list-text'>Fallecimiento</td><td><input type='text' id='txt_fallecimiento' value='"+ autores[indice].fallecimiento +"'></td></tr></table><div class='col-2'><button class='square-blue' onclick='Cerrarpop()'>Cerrar</button><button id="+ autores[indice].id +" onclick='editartema(this)' class='square-blue'>Editar</button></div></div>");
        }
    });
    PaisesVer();
  }




function AutoresVer(pagina){
    var tabla_autor = "";
    var total_autores = autores.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_autor += "<tr>";
    tabla_autor += "<td>#</td>";
    tabla_autor += "<td>Nombres</td>";
    tabla_autor += "<td>Apellidos</td>";
    tabla_autor += "<td>Nacionalidad</td>";
    tabla_autor += "<td>Fecha de ingreso</td>";
    tabla_autor += "<td>Operaciones</td>";
    tabla_autor += "</tr>";
    $.each(autores, function(indice, valor){
        if(indice >= inferior && indice < superior){
            tabla_autor += "<tr>";
            tabla_autor += "<td>"+(indice+1)+"</td>";
            tabla_autor += "<td>"+autores[indice].nombre+"</td>";
            tabla_autor += "<td>"+autores[indice].apellido+"</td>";
            tabla_autor += "<td>"+autores[indice].pais__nombre+"</td>";
            tabla_autor += "<td>"+autores[indice].fecha_ingreso+"</td>";
            tabla_autor += "<td><button id="+ autores[indice].id +" onclick='editar(this)' class='button-link'>Editar</button><button id="+ autores[indice].id +" onclick='Eliminar(this)' class='button-link'>Eliminar</button></td>";
            tabla_autor += "</tr>";
        }
    });
    var funcion_anterior = (inferior > 0)?'onclick="AutoresVer('+(pagina-1)+');"':'';
    var boton_anterior = '<button class="square-blue"'+funcion_anterior+'>Anterior</button>';
    var funcion_siguiente = (superior < total_autores)?'onclick="AutoresVer('+(pagina+1)+');"':'';
    var boton_siguiente = '<button class="square-blue"'+funcion_siguiente+'>Siguiente</button>';
    $("#tbl_tabla_autor").html(tabla_autor);
    $('.list-block-footer').html(boton_anterior+boton_siguiente);

}
