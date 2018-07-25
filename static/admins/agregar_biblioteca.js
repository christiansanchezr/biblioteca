function TemasAgregar(){
    var nuevo_biblioteca = $("#txt_nuevo_tema").val();
    var descripcion = $("#txt_descripcion").val();
    var ubicacion = $("#txt_ubicacion").val();
    var latitud = $("#txt_latitud").val();
    var longitud = $("#txt_longitud").val();

    if(nuevo_biblioteca == ""){
        alert("Ingresa una biblioteca");
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '/admins/bibliotecas/agregar/',
        data: {biblioteca : nuevo_biblioteca, descripcion : descripcion, ubicacion : ubicacion, latitud : latitud, longitud : longitud},
        beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => {
                switch (data['status']) {
                    case 0:
                            alert("Agregado correctamente")
                            window.location.href = "/admins/bibliotecas/"
                            break
                    case 1:
                            alert("Esta biblioteca ya ha sido registrada")
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
        localStorage.removeItem('usuario');
        window.location.href = "login.html";
    }
}
