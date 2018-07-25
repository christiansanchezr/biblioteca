var nueva_fecha = new Date();
$(document).ready(function(){

    $('#txt_fecha_autor').val(nueva_fecha.getFullYear()+'/'+(nueva_fecha.getMonth()+1)+'/'+nueva_fecha.getDate());
});

class Autor {
    constructor(nombre, apellido, pais, nacimiento, fallecimiento) {
        this.nombre = nombre
        this.apellido = apellido
        this.pais = pais
        this.nacimiento = nacimiento
        this.fallecimiento = fallecimiento
        this.fecha_ingreso = nueva_fecha.getFullYear()+'-'+(nueva_fecha.getMonth()+1)+'-'+nueva_fecha.getDate()

    }

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
                $("#slc_nacionalidad").html(opt);
            },
            error: (error, e) => {
                console.log(error + " " + e);
            }
        })
}
    PaisesVer();

function AutoresAgregar(){
    var nombre_autor = $("#txt_autor_nombre").val();
    var apellido_autor = $("#txt_autor_apellido").val();
    var nacionalidad = $("#slc_nacionalidad").val();
    var nacimiento_autor = $("#txt_nac_autor").val();
    var fallecimiento_autor = $("#txt_fallecimiento_autor").val();
    var fecha_ingreso = $('#txt_fecha_autor').val();

    var new_autor = new Autor(
                                nombre_autor,
                                apellido_autor,
                                nacionalidad,
                                nacimiento_autor,
                                fallecimiento_autor,
                                fecha_ingreso
                             )

    if(nombre_autor == ""){
        alert("Ingresa los nombres del autor");
        return false;
    }
    if(apellido_autor == ""){
        alert("Ingresa los apellidos del autor");
        return false;
    }
    if(nacionalidad == ""){
        alert("Ingresa la nacionalidad del autor");
        return false;
    }
    if(nacimiento_autor == ""){
        alert("Ingresa la fecha de nacimiento del autor");
        return false;
    }
    if(fallecimiento_autor.length > 0){
        if(fallecimiento_autor == ""){
            alert("Ingresa la fecha de fallecimiento del autor");
            return false;
        }
    }
    if(fecha_ingreso == ""){
        alert("Ingresa la fecha de ingreso");
            return false;
    }

    $.ajax({
        type: 'POST',
        url: '/admins/autores/agregar/',
        data: new_autor,
        beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
        },
        success: (data) => {
                switch (data['status']) {
                    case 0:
                            alert("Agregado correctamente")
                            window.location.href = "/admins/autores/"
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
}
