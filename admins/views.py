from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.core import serializers
from admins.models import Administrador, Municipio, Departamento, Libro, Autor, Tema, Pais, Biblioteca
from user.models import User, Prestamo, Historial
from django.views.generic import ListView
import secrets, json

# Create your views here.
'''Una clase que cuenta con dos metodos que se encargar de renderizar la pagina y enviar informacion. Recibir datos y devolver una respuesta'''
class Admin_registro(ListView):
    @staticmethod
    def get(request):
        departamentos = Departamento.objects.all()

        return render(request, 'admins/html/registro.html', {'departamentos' : departamentos})

    @staticmethod
    def post(request):
        data = request.POST

        correo = data.get("correo")

        usrtkn = secrets.token_hex(15)

        if (Administrador.objects.filter(correo=correo).exists()):
            respuesta = {'status' : 1}
        else:
            Administrador.objects.create(
                nombre = data.get("nombre"),
                apellido = data.get("apellido"),
                direccion = data.get("direccion"),
                telefono = data.get("telefono"),
                correo = data.get("correo"),
                contra = data.get("password"),
                genero = data.get("genero"),
                nacimiento = data.get("nacimiento"),
                cui = data.get("cui"),
                municipio = Municipio.objects.get(pk=data.get("municipio")),
                usrtkn = usrtkn,
            )

            respuesta = {'status' : 0, 'usrtkn' : usrtkn}

        return JsonResponse(respuesta)

class Admin_usuario(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/usuarios.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            admin = Administrador.objects.get(usrtkn=token)
        except Administrador.DoesNotExist:
            Admin = None

        if token != "":
            if not admin:
                return JsonResponse({'page' : '/user/login/'})
            else:
                usuarios = User.objects.all().values("id","nombre", "apellido", "municipio__nombre", "correo", "usrtkn")
                usuarios = json.dumps(list(usuarios), cls=serializers.json.DjangoJSONEncoder)

                return JsonResponse({'page' : '#', 'usuarios' : usuarios})
        else:
            return JsonResponse({'page' : '/user/login/'})

class Admin_bibliotecas(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/bibliotecas.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            admin = Administrador.objects.get(usrtkn=token)
        except Administrador.DoesNotExist:
            Admin = None

        if token != "":
            if not admin:
                return JsonResponse({'page' : '/user/login/'})
            else:
                bibliotecas = Biblioteca.objects.all().values("id","nombre", "ubicacion")
                bibliotecas = json.dumps(list(bibliotecas), cls=serializers.json.DjangoJSONEncoder)

                return JsonResponse({'page' : '#', 'bibliotecas' : bibliotecas})
        else:
            return JsonResponse({'page' : '/user/login/'})

def Admin_eliminarbibliotecas(request):
    data = request.POST.get("biblioteca")

    biblioteca = Biblioteca.objects.filter(pk=data).delete()

    if biblioteca[0] > 0:
        return JsonResponse({'status' : 1})
    else:
        return JsonResponse({'status' : 0})

def Admin_editarbibliotecas(request):
    data = request.POST

    biblioteca = Biblioteca.objects.filter(nombre=(data.get("biblioteca")))

    biblioteca.update(
                nombre=data.get("nbiblioteca"),
               )

    return HttpResponse("0")

'''Funciones que devuelven los municipio, temas, autores y paises en JSON'''
def cambiar_municipios(request):
    data = request.POST.get("departamento")

    data = (Municipio.objects.filter(departamento=data).values_list("nombre"))

    return HttpResponse(data)

def cambiar_temas(request):
    temas = Tema.objects.all()
    temas = serializers.serialize('json', temas)

    return JsonResponse({'temas' : temas})

def cambiar_autores(request):
    autores = Autor.objects.all()
    autores = serializers.serialize('json', autores)

    return JsonResponse({'autores' : autores})

def cambiar_paises(request):
    paises = Pais.objects.all()
    paises = serializers.serialize('json', paises)

    return JsonResponse({'paises' : paises})

def cambiar_bibliotecas(request):
    bibliotecas = Biblioteca.objects.all()
    bibliotecas = serializers.serialize('json', bibliotecas)

    return JsonResponse({'bibliotecas' : bibliotecas})

'''renderiza libros.html y obtiene el usuario. Si no es administrador se sale de la pagina, ademas devuelve la lista de libros y se serializa a JSON'''
class Admin_libros(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/libros.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            admin = Administrador.objects.get(usrtkn=token)
        except Administrador.DoesNotExist:
            admin = None

        if token != "":
            if not admin:
                return JsonResponse({'page' : '/user/login/'})
            else:
                libros = Libro.objects.all().values("id","nombre", "tema__tema", "existencia", "ubicacion", "biblioteca__nombre")
                libros = json.dumps(list(libros), cls=serializers.json.DjangoJSONEncoder)

                return JsonResponse({'page' : '#', 'libros' : libros})
        else:
            return JsonResponse({'page' : '/user/login/'})

def Admin_eliminarlibros(request):
    data = request.POST.get("libro")

    libro = Libro.objects.filter(pk=data).delete()

    if libro[0] > 0:
        return JsonResponse({'status' : 1})
    else:
        return JsonResponse({'status' : 0})

def Admin_editarlibros(request):
    data = request.POST

    libro = Libro.objects.filter(pk=(data.get("libro")))

    libro.update(
                nombre=data.get("titulo"),
                autor=Autor.objects.get(pk=data.get("autor")),
                tema=Tema.objects.get(pk=data.get("tema")),
                existencia=data.get("existencia"),
                ubicacion=data.get("ubicacion"),
                biblioteca=Biblioteca.objects.get(pk=data.get("biblioteca"))
               )

    return HttpResponse("0")

class Admin_autores(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/autores.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            admin = Administrador.objects.get(usrtkn=token)
        except Administrador.DoesNotExist:
            admin = None

        if token != "":
            if not admin:
                return JsonResponse({'page' : '/user/login/'})
            else:
                autores = Autor.objects.all().values("id","nombre", "apellido", "pais__nombre", "fecha_ingreso", "nacimiento", "fallecimiento")
                autores = json.dumps(list(autores), cls=serializers.json.DjangoJSONEncoder)

                return JsonResponse({'page' : '#', 'autores' : autores})
        else:
            return JsonResponse({'page' : '/user/login/'})

def Admin_eliminarautores(request):
    data = request.POST.get("autor")

    autor = Autor.objects.filter(pk=data).delete()

    if autor[0] > 0:
        return JsonResponse({'status' : 1})
    else:
        return JsonResponse({'status' : 0})

def Admin_editarautores(request):
    data = request.POST

    autor = Autor.objects.filter(pk=(data.get("autor")))

    autor.update(
                nombre=data.get("nombre"),
                apellido=data.get("apellido"),
                pais=Pais.objects.get(pk=data.get("pais")),
                nacimiento=data.get("nacimiento"),
                fallecimiento=data.get("fallecimiento")
               )

    return HttpResponse("0")


class Admin_temas(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/temas.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            admin = Administrador.objects.get(usrtkn=token)
        except Administrador.DoesNotExist:
            admin = None

        if token != "":
            if not admin:
                return JsonResponse({'page' : '/user/login/'})
            else:
                temas = Tema.objects.all().values("id","tema", "fecha_ingreso")
                temas = json.dumps(list(temas), cls=serializers.json.DjangoJSONEncoder)

                return JsonResponse({'page' : '#', 'temas' : temas})
        else:
            return JsonResponse({'page' : '/user/login/'})

def Admin_eliminartemas(request):
    data = request.POST.get("tema")

    tema = Tema.objects.filter(pk=data).delete()

    if tema[0] > 0:
        return JsonResponse({'status' : 1})
    else:
        return JsonResponse({'status' : 0})

def Admin_editartemas(request):
    data = request.POST

    tema = Tema.objects.filter(tema=(data.get("tema")))

    tema.update(tema=data.get("ntema"))

    return HttpResponse("0")


'''Obtiene el tituto que el usuario ingreso. Si aun no existe crea un nuevo libro'''
class Admin_agregarlibro(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/agregar_libro.html')

    @staticmethod
    def post(request):
        data = request.POST

        titulo = data.get("titulo")

        if (Libro.objects.filter(nombre=titulo).exists()):
            respuesta = {'status' : 1}
        else:
            Libro.objects.create(
                nombre = data.get("titulo"),
                autor = Autor.objects.get(pk=data.get("autor")),
                tema = Tema.objects.get(pk=data.get("tema")),
                existencia = data.get("existencia"),
                ubicacion = data.get("ubicacion"),
                fecha_ingreso = data.get("fecha_ingreso"),
                biblioteca=Biblioteca.objects.get(pk=data.get("biblioteca"))
            )

            respuesta = {'status' : 0}

        return JsonResponse(respuesta)

class Admin_agregarautor(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/agregar_autor.html')

    @staticmethod
    def post(request):
        data = request.POST

        nombre = data.get("nombre")

        if (Autor.objects.filter(nombre=nombre).exists()):
            respuesta = {'status' : 1}
        else:
            Autor.objects.create(
                nombre = data.get("nombre"),
                apellido = data.get("apellido"),
                pais = Pais.objects.get(pk=data.get("pais")),
                nacimiento = data.get("nacimiento"),
                fallecimiento = data.get("fallecimiento"),
                fecha_ingreso = data.get("fecha_ingreso")
            )

            respuesta = {'status' : 0}

        return JsonResponse(respuesta)

class Admin_agregartema(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/agregar_tema.html')

    @staticmethod
    def post(request):
        data = request.POST

        tema = data.get("tema")

        if (Tema.objects.filter(tema=tema).exists()):
            respuesta = {'status' : 1}
        else:
            Tema.objects.create(
                tema = data.get("tema"),
                fecha_ingreso = data.get("fecha_ingreso")
            )

            respuesta = {'status' : 0}

        return JsonResponse(respuesta)

class Admin_agregarbiblioteca(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/agregar_biblioteca.html')

    @staticmethod
    def post(request):
        data = request.POST

        biblioteca = data.get("biblioteca")

        if (Biblioteca.objects.filter(nombre=biblioteca).exists()):
            respuesta = {'status' : 1}
        else:
            Biblioteca.objects.create(
                nombre = data.get("biblioteca"),
                descripcion=data.get('descripcion'),
                ubicacion=data.get('ubicacion'),
                latitud=data.get('latitud'),
                longitud=data.get('longitud')
            )

            respuesta = {'status' : 0}

        return JsonResponse(respuesta)

class Admin_prestamos(ListView):
    @staticmethod
    def get(request):

        return render(request, 'admins/html/prestamos.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            admin = Administrador.objects.get(usrtkn=token)
        except Administrador.DoesNotExist:
            admin = None

        if token != "":
            if not admin:
                return JsonResponse({'page' : '/user/login/'})
            else:
                prestamos = Prestamo.objects.all().values("id","usuario__nombre", "libro__nombre", "fecha_prestamo", "fecha_entrega", "codigo", "estado")
                prestamos = json.dumps(list(prestamos), cls=serializers.json.DjangoJSONEncoder)

                return JsonResponse({'page' : '#', 'prestamos' : prestamos})
        else:
            return JsonResponse({'page' : '/user/login/'})

def Admin_devolver(request):
    data = request.POST.get("codigo")

    historial = Prestamo.objects.filter(codigo=data)
    historial = serializers.serialize('json', historial)
    historial = json.loads(historial)
    historial = historial[0]["fields"]

    Historial.objects.create(
                                usuario=User.objects.get(pk=historial["usuario"]),
                                libro=Libro.objects.get(pk=historial["libro"]),
                                fecha_prestamo=historial["fecha_prestamo"],
                                fecha_entrega=historial["fecha_entrega"],
                                codigo=historial["codigo"],
                                estado=historial["estado"]
                            )

    prestamo = Prestamo.objects.filter(codigo=data).delete()

    if prestamo[0] > 0:
        return JsonResponse({'status' : 1})
    else:
        return JsonResponse({'status' : 0})
