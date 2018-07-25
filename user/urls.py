from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('registro/', views.User_registro.as_view()),
    path('login/', views.Login.as_view(), name="index"),
    path('libros/', views.User_libros.as_view()),
    path('autores/', views.User_autores.as_view()),
    path('temas/',views.User_temas.as_view()),
    path('prestamos/',views.User_prestamos.as_view()),
    path('perfil/', views.User_perfil.as_view()),
    path('update/', views.actualizar),
    path('prestar/', views.prestar)
]
