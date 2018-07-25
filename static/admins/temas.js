var temas = 0;
$(document).ready(function(){
    var usuario = localStorage.getItem("usuario")

    if (usuario) {
        $.ajax({
            type: 'POST',
            url: '/admins/temas/',
            data: {usuario : usuario},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {
                temas = $.parseJSON(data["temas"])
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

function Eliminar(tema) {
  tema = $(tema).prop("id")
  $.ajax({
          type: 'POST',
          url: '/admins/temas/eliminar/',
          data: {tema: tema},
          beforeSend: (xhr) => {
              xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
          },
          success: (data) => {
              switch (data['status']) {
                case 1:
                  alert("Eliminado")
                  window.location.href = "/admins/temas/"
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

function editartema(tema) {
    tema = $(tema).prop("id")
    ntema = $("#txt_tema").val()
    $.ajax({
        type: 'POST',
        url: '/admins/temas/editar/',
        data: {tema: tema, ntema: ntema},
        beforeSend: (xhr) => {
            xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => {
            switch (data) {
              case '0':
                alert("Modificado")
                window.location.href = "/admins/temas/"
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

function editar(tema){
  tema = $(tema).prop("id")
  $("body").append("<div class='pop-prestar'><table><tr class='table-list-title'><td>Tema</td></tr><tr class='table-list-element'><td class='table-list-text'>Tema</td><td><input type='text' id='txt_tema' value='"+ tema +"'></td></tr></table><div class='col-2'><button class='square-blue' onclick='Cerrarpop()'>Cerrar</button><button id="+tema+" onclick='editartema(this)' class='square-blue'>Editar</button></div></div>");
}


function Cerrarpop() {
    $(".pop-prestar").remove();
}

function TemasVer(pagina){
    var tabla_tema = "";
    var total_temas = temas.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_tema += "<tr>";
            tabla_tema += "<td><strong>#</strong></td>";
            tabla_tema += "<td><strong>Tema</strong></td>";
            tabla_tema += "<td><strong>Fecha de ingreso</strong></td>";
            tabla_tema += "<td><strong>Operaciones</strong></td>";
            tabla_tema += "</tr>";
    $.each(temas, function(indice, valor){
        if(indice >= inferior && indice < superior){
            tabla_tema += "<tr>";
            tabla_tema += "<td>"+(indice+1)+"</td>";
            tabla_tema += "<td>"+temas[indice].tema+"</td>";
            tabla_tema += "<td>"+temas[indice].fecha_ingreso+"</td>";
            tabla_tema += "<td><button id="+ temas[indice].tema +" onclick='editar(this)' class='button-link'>Editar</button><button id="+ temas[indice].id +" onclick='Eliminar(this)' class='button-link'>Eliminar</button></td>";
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
