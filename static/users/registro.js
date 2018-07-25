var aceptar_registro = [0,0,0,0,0,0];

class Usuario {
    constructor(nombre, apellido, direccion, telefono, correo, contra, genero, nacimiento, cui, municipio, zona, educacion, instituto, imagen) {
        this.nombre = nombre
        this.apellido = apellido
        this.direccion = direccion
        this.telefono = telefono
        this.correo = correo
        this.contra = contra
        this.correo = correo
        this.genero = genero
        this.nacimiento = nacimiento
        this.cui = cui
        this.municipio = municipio
        this.zona = zona
        this.educacion = educacion
        this.instituto = instituto
        this.imagen = imagen
        this.estado = "true"
        this.prestamos = new Array()
        this.historial = new Array()
    }
}
//Se obitnene el objeto y se ordena eliminando sus signos y se crea un array
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


var imagen;

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

  function SelectBiblio(){
    let biblioteca = $("#slc_biblioteca").val()
    localStorage.setItem("biblioteca",biblioteca)
    window.location.href = "/user/libros/"
  }


$("#btn_registrar").on("click",function(){

    if (aceptar_registro[0] == 1 && aceptar_registro[1] == 1 && aceptar_registro[2] == 1 && aceptar_registro[3] == 1 && aceptar_registro[4] == 1 && aceptar_registro[5] == 1) {

        let nombre = $("#txt_nombre").val();
        let apellido = $("#txt_apellido").val();
        let direccion = $("#txt_direccion").val();
        let telefono = $("#txt_tel").val();
        let correo = $("#txt_correo").val();
        let contra = $("#txt_contra").val();
        let zona = $("#txt_zona").val();
        let instituto = $("#txt_edu").val();
        let genero = $("input:radio[name=rad_genero]:checked").prop("id");

        let nacimiento = $("#txt_fecha").val();
        let cui = $("#txt_cui").val();
        let municipio = $("#sl_muni").prop("value");
        let educacion = $("#sl_escolaridad").val();

        if (genero == "rad_fem") {
            genero = "femenino";
        }else if (genero == "rad_mas"){
            genero = "masculino";
        }

        new_user = new Usuario (
                                nombre,
                                apellido,
                                direccion,
                                telefono,
                                correo,
                                contra,
                                genero,
                                nacimiento,
                                cui,
                                municipio,
                                zona,
                                educacion,
                                instituto,
                                imagen
                               )

        $.ajax({
                type: 'POST',
                url: '/user/registro/',
                data: new_user,
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
                },
                success: (data) => {
                    switch (data['status']) {
                        case 0:
                                localStorage.setItem("usuario", data['usrtkn'])
                                $("body").append("<div class='pop-prestar'><center><h3>Seleccion una biblioteca</h3><select id='slc_biblioteca'></select><button onclick='SelectBiblio();' class='square-blue'>Ir</button></center></div>");
                                BibliotecaLista()
                                break
                        case 1:
                                alert("Este usuario ya ha sido registrdo")
                        default:
                                alert("Hay algun problema con el servidor. Intentalo mas tarde")
                    }
                    },
                error: (error) => {
                        alert("Hay algun problema con el servidor. Intentalo mas tarde")
                }
               })

    }else{
        alert("Debes llenar bien todos los campos");
    }

});
