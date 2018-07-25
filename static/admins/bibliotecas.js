var bibliotecas = 0;
$(document).ready(function(){
    var usuario = localStorage.getItem("usuario")

    if (usuario) {
        $.ajax({
            type: 'POST',
            url: '/admins/bibliotecas/',
            data: {usuario : usuario},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {
                bibliotecas = $.parseJSON(data["bibliotecas"])
                return (data['page']!=="#")?window.location.href = data['page']:TemasVer(1);
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

function Eliminar(biblioteca) {
  biblioteca = $(biblioteca).prop("id")
  $.ajax({
          type: 'POST',
          url: '/admins/bibliotecas/eliminar/',
          data: {biblioteca: biblioteca},
          beforeSend: (xhr) => {
              xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
          },
          success: (data) => {
              switch (data['status']) {
                case 1:
                  alert("Eliminado")
                  window.location.href = "/admins/bibliotecas/"
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

function editarbiblioteca(biblioteca) {
    biblioteca = $(biblioteca).prop("id")
    nbiblioteca = $("#txt_biblioteca").val()
    $.ajax({
        type: 'POST',
        url: '/admins/bibliotecas/editar/',
        data: {biblioteca: biblioteca, nbiblioteca: nbiblioteca},
        beforeSend: (xhr) => {
            xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => {
            switch (data) {
              case '0':
                alert("Modificado")
                window.location.href = "/admins/bibliotecas/"
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

function editar(biblioteca){
  biblioteca = $(biblioteca).prop("id")
  $("body").append("<div class='pop-prestar'><table><tr class='table-list-title'><td>Tema</td></tr><tr class='table-list-element'><td class='table-list-text'>Nombre</td><td><input type='text' id='txt_biblioteca' value='"+ biblioteca +"'></td></tr></table><div class='col-2'><button class='square-blue' onclick='Cerrarpop()'>Cerrar</button><button id="+biblioteca+" onclick='editarbiblioteca(this)' class='square-blue'>Editar</button></div></div>");
}


function Cerrarpop() {
    $(".pop-prestar").remove();
}

function TemasVer(pagina){
    var tabla_tema = "";
    var total_temas = bibliotecas.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_tema += "<tr>";
            tabla_tema += "<td><strong>#</strong></td>";
            tabla_tema += "<td><strong>Nombre</strong></td>";
            tabla_tema += "<td><strong>Ubicacion</strong></td>";
            tabla_tema += "<td><strong>Operaciones</strong></td>";
            tabla_tema += "</tr>";
    $.each(bibliotecas, function(indice, valor){
        if(indice >= inferior && indice < superior){
            tabla_tema += "<tr>";
            tabla_tema += "<td>"+(indice+1)+"</td>";
            tabla_tema += "<td>"+bibliotecas[indice].nombre+"</td>";
            tabla_tema += "<td>"+bibliotecas[indice].ubicacion+"</td>";
            tabla_tema += "<td><button id="+ bibliotecas[indice].nombre +" onclick='editar(this)' class='button-link'>Editar</button><button id="+ bibliotecas[indice].id +" onclick='Eliminar(this)' class='button-link'>Eliminar</button></td>";
            tabla_tema += "</tr>";
        }
    });
    var funcion_anterior = (inferior > 0)?'onclick="TemasVer('+(pagina-1)+');"':'';
    var boton_anterior = '<button class="square-blue" '+funcion_anterior+'>Anterior</button>';
    var funcion_siguiente = (superior < total_temas)?'onclick="TemasVer('+(pagina+1)+');"':'';
    var boton_siguiente = '<button class="square-blue" '+funcion_siguiente+'>Siguiente</button>';
    $("#tbl_tabla_temas").html(tabla_tema);
    $('.list-block-footer').html(boton_anterior+boton_siguiente);
}
