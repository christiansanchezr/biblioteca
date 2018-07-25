from django.db import models
from admins.models import Libro, Municipio

# Create your models here.
class User(models.Model):
    nombre = models.CharField(max_length=64, null=False)
    apellido = models.CharField(max_length=64, null=False)
    direccion = models.CharField(max_length=54, null=False)
    telefono = models.IntegerField(null=False)
    correo = models.EmailField(null=False)
    contra = models.CharField(max_length=120, null=False)
    genero = models.CharField(max_length=42, null=False)
    date = models.DateField(null=False)
    cui = models.CharField(max_length=14, null=False)
    municipio = models.ForeignKey(Municipio, on_delete=models.CASCADE)
    zona = models.CharField(max_length=2, null=False)
    institucion = models.CharField(max_length=120, null=False)
    escolaridad = models.CharField(max_length=120, null=False)
    imagen = models.TextField()
    usrtkn = models.CharField(max_length=30,null=False)

    def __str__(self):
        return self.correo

class Prestamo(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    fecha_prestamo = models.DateField(null=False)
    fecha_entrega = models.DateField(null=False)
    codigo = models.CharField(max_length=54,null=False)
    estado = models.BooleanField(null=False)

    def __str__(self):
        return str(self.libro)

class Historial(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    fecha_prestamo = models.DateField(null=False)
    fecha_entrega = models.DateField(null=False)
    codigo = models.CharField(max_length=54,null=False)
    estado = models.BooleanField(null=False)

    def __str__(self):
        return str(self.libro)
