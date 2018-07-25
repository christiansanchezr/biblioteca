
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

$("#btn_login").on("click", () => {
  console.log("click")

  var correo = $("#log_correo").val();
  var contra = $("#log_contra").val();
//envia el usuario y contraseña ingresada
  $.ajax({
    type: 'POST',
    url: '/user/login/',
    data: {correo : correo, contra : contra},
    beforeSend: (xhr) => {
          xhr.setRequestHeader('X-CSRFToken', $('input:hidden[name=csrfmiddlewaretoken]').val())
    },
    success: (data) => {
          console.log(JSON.stringify(data))
          switch (data['status']){ //Si el usuario no es correcto devuelve un 0. Si lo es devuelve el numero segun su tipo
            case 1:
                    localStorage.setItem("usuario", data['usrtkn'])
                    window.location.href = "/admins/libros/"
                    break
            case 2:
                    localStorage.setItem("usuario", data['usrtkn'])
                    $("body").append("<div class='pop-prestar'><center><h3>Seleccion una biblioteca</h3><select id='slc_biblioteca'></select><button onclick='SelectBiblio();' class='square-blue'>Ir</button></center></div>");
                    BibliotecaLista()
                    break
            case 0:
                    alert("El usuario o contraseña son incorrectos")
                    break
          }
    },
    error: (error) => {
          alert("Hay algun problema con el servidor. Intentalo mas tarde")
    }
    });

});
