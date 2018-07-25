var nueva_fecha = new Date();
$(document).ready(function(){

    $('#txt_fecha_tema').val(nueva_fecha.getFullYear()+'/'+(nueva_fecha.getMonth()+1)+'/'+nueva_fecha.getDate());
});

class Tema {
    constructor(tema) {
        this.tema = tema
        this.fecha_ingreso = nueva_fecha.getFullYear()+'-'+(nueva_fecha.getMonth()+1)+'-'+nueva_fecha.getDate()

    }
}

function TemasAgregar(){
    var nuevo_tema = $("#txt_nuevo_tema").val();
    var fecha_ingreso =  $('#txt_fecha_tema').val();
    
    var new_tema = new Tema(
        nuevo_tema,
        fecha_ingreso
     )

    if(nuevo_tema == ""){
        alert("Ingresa un tema");
        return false;
    }
    if(fecha_ingreso == ""){
        alert("La fecha no puede estar vacia");
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '/admins/temas/agregar/',
        data: new_tema,
        beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => {
                switch (data['status']) {
                    case 0:
                            alert("Agregado correctamente")
                            window.location.href = "/admins/temas/"
                            break
                    case 1:
                            alert("Este tema ya ha sido registrdo")
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