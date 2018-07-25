from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('registro/', views.Admin_registro.as_view()),
    path('municipios/', views.cambiar_municipios),
    path('ctemas/', views.cambiar_temas),
    path('cautores/', views.cambiar_autores),
    path('paises/', views.cambiar_paises),
    path('bibliotecas/', views.Admin_bibliotecas.as_view()),
    path('cbibliotecas/', views.cambiar_bibliotecas),
    path('libros/', views.Admin_libros.as_view()),
    path('autores/', views.Admin_autores.as_view()),
    path('temas/',views.Admin_temas.as_view()),
    path('usuarios/',views.Admin_usuario.as_view()),
    path('libros/agregar/', views.Admin_agregarlibro.as_view()),
    path('autores/agregar/',views.Admin_agregarautor.as_view()),
    path('temas/agregar/',views.Admin_agregartema.as_view()),
    path('temas/eliminar/',views.Admin_eliminartemas),
    path('libros/eliminar/',views.Admin_eliminarlibros),
    path('autores/eliminar/',views.Admin_eliminarautores),
    path('temas/editar/',views.Admin_editartemas),
    path('bibliotecas/eliminar/',views.Admin_eliminarbibliotecas),
    path('bibliotecas/editar/',views.Admin_editarbibliotecas),
    path('autores/editar/',views.Admin_editarautores),
    path('libros/editar/',views.Admin_editarlibros),
    path('bibliotecas/agregar/', views.Admin_agregarbiblioteca.as_view()),
    path('prestamos/', views.Admin_prestamos.as_view()),
    path('prestamos/devolver/', views.Admin_devolver),
]
