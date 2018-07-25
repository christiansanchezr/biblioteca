from django.shortcuts import render
from user.models import User, Prestamo, Historial
from django.http import HttpResponse, JsonResponse
from django.views.generic import ListView
from admins.models import Administrador, Departamento, Municipio, Libro, Autor, Tema
from django.core import serializers
import json, secrets

# Create your views here.

'''Obtiene el correo y contraseña del usuario. Si existe algun usuario (ya sea admin o user) segun su token este lo redirige segun el tipo de usuario'''
class Login(ListView):

    @staticmethod
    def get(request):
        return render(request, 'user/html/index.html')

    @staticmethod
    def post(request):
        data = request.POST

        contra = request.POST.get("contra")
        correo = request.POST.get("correo")
        user = Administrador.objects.filter(correo=correo, contra=contra) or User.objects.filter(correo=correo, contra=contra)

        if user:
            try:
                Administrador.objects.get(usrtkn=user[0].usrtkn)
                admintype = 1
            except Administrador.DoesNotExist:
                admintype = None

            try:
                User.objects.get(usrtkn=user[0].usrtkn)
                usertype = 2
            except User.DoesNotExist:
                usertype = None

            return JsonResponse({'usrtkn' : user[0].usrtkn, 'status' : admintype or usertype})
        else:
            return JsonResponse({'status' : 0})

'''genera un tocken en hexadecimal que sera utilizado en cada usuario. Luego crea un nuevo usuario segun la informacion registrada y agrega su nuevo tocken'''
class User_registro(ListView):
    @staticmethod
    def get(request):
        departamentos = Departamento.objects.all()

        return render(request, 'user/html/registro.html', {'departamentos' : departamentos})

    @staticmethod
    def post(request):
        data = request.POST

        correo = request.POST.get("correo")

        usrtkn = secrets.token_hex(15)

        if (User.objects.filter(correo=correo).exists()):
            respuesta = {'status' : 1}
        else:
            User.objects.create(
                nombre = request.POST.get("nombre"),
                apellido = request.POST.get("apellido"),
                direccion = request.POST.get("direccion"),
                telefono = request.POST.get("telefono"),
                correo = request.POST.get("correo"),
                contra = request.POST.get("contra"),
                genero = request.POST.get("genero"),
                date = request.POST.get("nacimiento"),
                cui = request.POST.get("cui"),
                municipio = Municipio.objects.get(pk=request.POST.get("municipio")),
                zona = request.POST.get("zona"),
                escolaridad = request.POST.get("educacion"),
                institucion = request.POST.get("instituto"),
                imagen = request.POST.get("imagen"),
                usrtkn = usrtkn,
            )

            respuesta = {'status' : 0, 'usrtkn' : usrtkn}

        return JsonResponse(respuesta)

'''Obtiene el tocken del usuario y verifica que sea un usuario. Si no, se sale de la pagina. Ademas envia la lista de libros y lo serializa a JSON'''
class User_libros(ListView):
    @staticmethod
    def get(request):

        return render(request, 'user/html/libros.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            user = User.objects.get(usrtkn=token)
        except User.DoesNotExist:
            user = None

        if token != "":
            if not user:
                return JsonResponse({'page' : '/user/login/'})
            else:
                libros = Libro.objects.filter(biblioteca__pk=request.POST.get("biblioteca")).values("id","nombre", "autor__nombre", "tema__tema", "existencia", "ubicacion", "fecha_ingreso", "biblioteca__nombre")
                libros = json.dumps(list(libros), cls=serializers.json.DjangoJSONEncoder)

                return JsonResponse({'page' : '#', 'libros' : libros})
        else:
            return JsonResponse({'page' : '/user/login/'})

class User_autores(ListView):
    @staticmethod
    def get(request):
        return render(request, 'user/html/autores.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            user = User.objects.get(usrtkn=token)
        except User.DoesNotExist:
            user = None

        if token != "":
            if not user:
                return JsonResponse({'page' : '/user/login/'})
            else:
                autores = Autor.objects.all().values("id","nombre","apellido","nacimiento","fallecimiento","pais__nombre","fecha_ingreso")
                autores = json.dumps(list(autores), cls=serializers.json.DjangoJSONEncoder)
                return JsonResponse({'page' : '#', 'autores' : autores})
        else:
            return JsonResponse({'page' : '/user/login/'})

class User_temas(ListView):
    @staticmethod
    def get(request):
        return render(request, 'user/html/temas.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            user = User.objects.get(usrtkn=token)
        except User.DoesNotExist:
            user = None

        if token != "":
            if not user:
                return JsonResponse({'page' : '/user/login/'})
            else:
                temas = Tema.objects.all()
                temas = serializers.serialize('json', temas)
                return JsonResponse({'page' : '#', 'temas' : temas})
        else:
            return JsonResponse({'page' : '/user/login/'})

class User_prestamos(ListView):
    @staticmethod
    def get(request):
        return render(request, 'user/html/prestamos.html')

    @staticmethod
    def post(request):
        token = request.POST.get('usuario') or ""

        try:
            user = User.objects.get(usrtkn=token)
        except User.DoesNotExist:
            user = None

        if token != "":
            if not user:
                return JsonResponse({'page' : '/user/login/'})
            else:
                prestamos = Prestamo.objects.filter(usuario=user).values("id", "libro__nombre", "libro__autor__nombre", "codigo", "fecha_prestamo", "fecha_entrega", "estado")
                prestamos = json.dumps(list(prestamos), cls=serializers.json.DjangoJSONEncoder)
                historial = Historial.objects.filter(usuario=user).values("id", "libro__nombre", "libro__autor__nombre", "codigo", "fecha_prestamo", "fecha_entrega", "estado")
                historial = json.dumps(list(historial), cls=serializers.json.DjangoJSONEncoder)
                return JsonResponse({'page' : '#', 'prestamos' : prestamos, 'historial' : historial})
        else:
            return JsonResponse({'page' : '/user/login/'})


'''funcion que obtiene el libro que desea prestar y el tocken del usuario. Segun esos datos agrega un nuevo libro prestado segun el token del usuario'''
def prestar(request):
    data = request.POST

    usuario = data.get("usuario")
    libro = data.get("libro")
    codigo = data.get("codigo")

    try:
        prestamos = Prestamo.objects.filter(usuario__usrtkn=usuario).count()
        existencias = Libro.objects.get(pk=libro).existencia
    except Prestamo.DoesNotExist:
        prestamos = 0
        existencias = 0

    if prestamos < 10 and existencias > 0:
        Prestamo.objects.create(
                                usuario=User.objects.get(usrtkn=usuario),
                                libro=Libro.objects.get(pk=libro),
                                fecha_entrega=data.get("fecha_entrega"),
                                fecha_prestamo=data.get("fecha_prestamo"),
                                estado=True,
                                codigo = codigo,
                               )
        Libro.objects.filter(pk=libro).update(existencia=existencias-1)
        return HttpResponse(1)
    else:
        return HttpResponse(0)

class User_perfil(ListView):
    @staticmethod
    def get(request):

        return render(request, 'user/html/perfil.html', {'departamentos' : Departamento.objects.all()})

    @staticmethod
    def post(request):
        data = request.POST.get("usuario")

        try:
            user = User.objects.filter(usrtkn=data)
        except User.DoesNotExist:
            user = None

        if not user:
            return JsonResponse({'page' : '/user/login/'})
        else:
            usuario = serializers.serialize('json', user)
            return JsonResponse({'page' : '#', 'usuario' : usuario})

'''Funcion que busca un usuario segun el id que obtiene. luego actualiza sus datos'''
def actualizar(request):
    data = request.POST

    usuario = User.objects.filter(pk=(data.get("usr_id")))

    usuario.update(
                    nombre=data.get("nombre"),
                    apellido=data.get("apellido"),
                    direccion=data.get("direccion"),
                    telefono=data.get("telefono"),
                    correo=data.get("correo"),
                    municipio=Municipio.objects.get(pk=data.get("municipio")),
                    zona=data.get("zona"),
                    institucion=data.get("institucion"),
                    escolaridad=data.get("educacion"),
                    contra=data.get("contra"),
                    genero=data.get("genero"),
                    cui=data.get("cui"),
                    date=data.get("nacimiento"),
                    imagen=data.get("imagen")
                  )

    return HttpResponse("0")
