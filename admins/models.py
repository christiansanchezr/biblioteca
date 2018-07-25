from django.db import models

# Create your models here.
class Biblioteca(models.Model):
    nombre = models.CharField(max_length=128, null=False)
    ubicacion = models.TextField()
    descripcion = models.TextField()
    latitud = models.CharField(max_length=128)
    longitud = models.CharField(max_length=128)

    def __str__(self):
        return self.nombre

class Pais(models.Model):
    nombre = models.CharField(max_length=120)

    def __str__(self):
        return self.nombre

class Departamento(models.Model):
    nombre = models.CharField(max_length=120)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Municipio(models.Model):
    nombre = models.CharField(max_length=120)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Administrador(models.Model):
    nombre = models.CharField(max_length=68, null=False)
    apellido = models.CharField(max_length=68, null=False)
    direccion = models.CharField(max_length=100, null=False)
    telefono = models.IntegerField(null=False)
    correo = models.EmailField(null=False)
    contra = models.CharField(max_length=120,null=False)
    genero = models.CharField(max_length=20)
    nacimiento = models.DateField(null=False)
    cui = models.IntegerField(null=False)
    municipio = models.ForeignKey(Municipio, on_delete=models.CASCADE)
    usrtkn = models.CharField(max_length=30,null=False)

    def __str__(self):
        return self.correo

class Autor(models.Model):
    nombre = models.CharField(max_length=128, null=False)
    apellido = models.CharField(max_length=128, null=False)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE)
    nacimiento = models.DateField(null=False)
    fallecimiento = models.DateField()
    fecha_ingreso = models.DateField()

    def __str__(self):
        return self.nombre + " " + self.apellido

class Tema(models.Model):
    tema = models.CharField(max_length=82, null=False)
    fecha_ingreso = models.DateField()

    def __str__(self):
        return self.tema

class Libro(models.Model):
    nombre = models.CharField(max_length=128, null=False)
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE)
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE)
    existencia = models.PositiveIntegerField(null=False)
    ubicacion = models.TextField(null=False)
    fecha_ingreso = models.DateField()
    biblioteca = models.ForeignKey(Biblioteca, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
