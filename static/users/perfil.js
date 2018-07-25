var aceptar_registro = [0,0,0,0,0,0];

var usuario = localStorage.getItem("usuario")
var usr_info = 0;
var usr_id = 0;

//Obtiene la informacion que se devolvio segun el usuario. Se crea antes de se llamada ya que genera un error al no hacerlo
function Mostrar() {
    $("#txt_nombre").val(usr_info[0]["fields"]["nombre"]);
    $("#txt_apellido").val(usr_info[0]["fields"]["apellido"]);
    $("#txt_direccion").val(usr_info[0]["fields"]["direccion"]);
    $("#txt_tel").val(usr_info[0]["fields"]["telefono"]);
    $("#txt_correo").val(usr_info[0]["fields"]["correo"]);
    $("#txt_zona").val(usr_info[0]["fields"]["zona"]);
    $("#txt_edu").val(usr_info[0]["fields"]["institucion"]);

    $("#txt_fecha").val(usr_info[0]["fields"]["date"]);
    $("#txt_cui").val(usr_info[0]["fields"]["cui"]);
    $("#sl_muni").val(usr_info[0]["fields"]["municipio"])
    $("#sl_escolaridad").val(usr_info[0]["fields"]["escolaridad"]);
    $("#img-perfil").attr("src", usr_info[0]["fields"]["imagen"]);
    $("#txt_contra").val(usr_info[0]["fields"]["contra"])


}

$(document).ready(function() {
///Envia el token del usuario y luego devuelve su informacion. Si el tipo es un admin lo saca
$.ajax({
    type: 'POST',
    url: '/user/perfil/',
    data: {usuario : usuario},
    beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
    },
    success: (data) => {
        usr_info = $.parseJSON(data['usuario'])
        usr_id = usr_info[0]["pk"]
        console.log(data)


        return (data['page']!=="#")?window.location.href = data['page']:Mostrar();
    }
})



//Devuelve los municipio en lista. Esta lista esta desordenada asi que se eliminan los signos y se ordenan para luego crear un array de ellos
function BuscarMuni(departamento){
    $.ajax({
        url:'/admins/municipios/',
        datatype: 'JSON',
        type: 'POST',
        data: {
                departamento: departamento,
                csrfmiddlewaretoken: $('input:hidden[name=csrfmiddlewaretoken]').val()
              },
        success: (data) => {
            data = data.toString();
            res = data.replace(/\(\'|\'\,\)/g, "/");
            res = res.split("/")
            res = res.filter(e => e !== '');
            opt = new String();
            $.each(res, (i,v) => {
                opt+="<option value = "+(i+1)+">"+v+"</option>";
            });
            $("#sl_muni").html(opt);
        },
        error: (error, e) => {
            console.log(error + " " + e);
        }
    })
}

BuscarMuni($("#sl_dept").val());

$("#sl_dept").on("change", () => {

    BuscarMuni($("#sl_dept").val());

})

$("#btn_cterminos").on('click',function(){
    $(".terminos").fadeToggle(200);
});

$("#hterminos").on('click',function(){
    $(".terminos").fadeToggle(200);
});


function Validartelefono(e) {
    if (($(e).val()).length < 8) {
        alert("El telefono debe tener 8 digitos");
        aceptar_registro[0] = 0;
    }else{
        aceptar_registro[0] = 1;
    }
}

function Validarform(event,t) {
    var tecla = (document.all)?event.keyCode:event.which;

    switch(t){
        case 0:
            if(tecla == 8 || tecla == 32){
                return true;
            }else{
                var patron = /^[A-Za-z]+$/;
            }
            break;
        case 1:
            if(tecla == 8){
                return true;
            }else{
                var patron = /[0-9]/;
            }
            break;
    }
    var tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

function Validarcorreo() {
    if ((/^[A-Za-z0-9\.-]+\w+@[a-zA-Z]{2,8}\.[a-zA-Z0-9]{2,4}$/).test($("#txt_correo").val()) == false) {
        $("#p_correo").show();
        aceptar_registro[1] = 0;
    }else{
        $("#p_correo").hide();
        aceptar_registro[1] = 1;
    }
}

function Validarcontra() {
    let contra = $("#txt_contra").val();

    if (contra.length > 6) {
        if  ((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&])([A-Za-z\d$@!%*?&]|[^ ]){8,16}$/).test(contra)) {
            aceptar_registro[2] = 1;
        }else{
            alert("La contraseña debe tener al menos 2 mayusculas, 2 minusculas, 1 numero, 1 simbolo");
            aceptar_registro[2] = 0;
        }
    }else{
        alert("La contraseña debe tener minimo 8 digitos");
        aceptar_registro[2] = 0;
    }
}

function Concontra() {
    let contra = $("#txt_contra").val();
    let concontra = $("#txt_concontra").val();

    if (contra != concontra) {
        $("#concontra").show();
        aceptar_registro[3] = 0;
    }else{
        $("#concontra").hide();
        aceptar_registro[3] = 1;
    }
}

function Validarcui() {
    if (($("#txt_cui").val()).length < 13 || ($("#txt_cui").val()).length > 13) {
        $("#p_cui").show();
        aceptar_registro[4] = 0;
    }else{
        $("#p_cui").hide();
        aceptar_registro[4] = 1;
    }
}

function Validarfecha(e) {

    var fecha_hoy = new Date();

    if ($(e).val() == "") {
        alert("Debes completar la fecha de nacimiento");
        aceptar_registro[5] = 0;
    }else{
        var fecha_usr = ($(e).val()).split("-");
        var edad_anio = Number(fecha_hoy.getFullYear()) - Number(fecha_usr[0]);
        var mayor_edad = false;

        if(edad_anio > 18){
            mayor_edad = true;
            aceptar_registro[5] = 1;
            $("#chk_tutores").prop("disabled", true);
        }else if(edad_anio == 18 && fecha_usr[1] <= fecha_hoy.getMonth()+1 && fecha_usr[2] <= fecha_hoy.getDate()){
            mayor_edad = true;
            $("#chk_tutores").prop("disabled", true);
            aceptar_registro[5] = 1;
        }else{
            mayor_edad = false;
            $("#chk_tutores").prop("disabled", false);
            aceptar_registro[5] = 0;
        }
    }
}


var imagen = $("#img-perfil").prop("src");

function handleFileSelect(evt) {
    var files = evt.target.files;

    for (var i = 0; f = files[i]; i++) {

      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          $("#list").children().remove();
          span = document.createElement('span');

          imagen = e.target.result;

          span.innerHTML = ['<img style="width: 72px; height 72px; border-radius: 50%;" class="thumb" src="', imagen,
                            '" title="', theFile.name, '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);

      reader.readAsDataURL(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);

$("#btn_registrar").on("click",function(){

    //if (aceptar_registro[0] == 1 && aceptar_registro[1] == 1 && aceptar_registro[2] == 1 && aceptar_registro[3] == 1 && aceptar_registro[4] == 1 && aceptar_registro[5] == 1) {

///Se envia la informacion actualizada y se cambian sus datos.
        let genero = $("input:radio[name=rad_genero]:checked").prop("id");

        if (genero == "rad_fem") {
            genero = "femenino";
        }else if (genero == "rad_mas"){
            genero = "masculino";
        }

        console.log($("#txt_correo").val())

        $.ajax({
            type: 'POST',
            url: '/user/update/',
            data: {
                    usr_id : usr_id,
                    nombre : $("#txt_nombre").val(),
                    apellido : $("#txt_apellido").val(),
                    direccion : $("#txt_direccion").val(),
                    telefono : $("#txt_tel").val(),
                    correo : $("#txt_correo").val(),
                    contra : $("#txt_contra").val(),
                    zona : $("#txt_zona").val(),
                    institucion : $("#txt_edu").val(),
                    nacimiento : $("#txt_fecha").val(),
                    cui : $("#txt_cui").val(),
                    municipio : $("#sl_muni").prop("value"),
                    educacion : $("#sl_escolaridad").val(),
                    genero : genero,
                    imagen : imagen,
                  },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
            },
            success: (data) => {

                console.log(data)
                switch (data) {
                    case '0':
                            alert("Usuario actualizado")
                            break
                    default:
                            alert("Hay algun problema con el servidor. Intentalo mas tarde")
                            break
                }
                },
            error: (error) => {
                    alert("Hay algun problema con el servidor. Intentalo mas tarde sds")
            }
           })

   // }else{
     ///   alert("Debes llenar bien todos los campos");
   // }

});

});
