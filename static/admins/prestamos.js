var prestamos = 0;
$(document).ready(function(){
    var usuario = localStorage.getItem("usuario")

    if (usuario) {
        $.ajax({
            type: 'POST',
            url: '/admins/prestamos/',
            data: {usuario : usuario},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {
                prestamos = $.parseJSON(data["prestamos"])
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

  function Cerrarpop() {
      $(".pop-prestar").remove();
  }

  function Devolver() {
    codigo = $("#txt_dev").val()
    $.ajax({
            type: 'POST',
            url: '/admins/prestamos/devolver/',
            data: {codigo: codigo},
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {
                switch (data['status']) {
                  case 1:
                    alert("Devuelto")
                    window.location.href = "/admins/prestamos/"
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

function LibrosVer(pagina){
    var tabla_libro = "";
    var total_libros = prestamos.length;
    var inferior = (pagina * 10) - 10;
    var superior = pagina * 10;
    tabla_libro += "<tr>";
    tabla_libro += "<td>#</td>";
    tabla_libro += "<td>Usuario</td>";
    tabla_libro += "<td>Libro</td>";
    tabla_libro += "<td>Fecha de entrega</td>";
    tabla_libro += "<td>Codigo</td>";
    tabla_libro += "<td>Estado</td>";
    tabla_libro += "</tr>";
    $.each(prestamos, function(indice, valor){
        if(indice >= inferior && indice < superior){
            tabla_libro += "<tr>";
            tabla_libro += "<td>"+(indice+1)+"</td>";
            tabla_libro += "<td>"+prestamos[indice].usuario__nombre+"</td>";
            tabla_libro += "<td>"+prestamos[indice].libro__nombre+"</td>";
            tabla_libro += "<td>"+prestamos[indice].fecha_entrega+"</td>";
            tabla_libro += "<td>"+prestamos[indice].codigo+"</td>";
            tabla_libro += "<td>"+prestamos[indice].estado+"</td>";
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
