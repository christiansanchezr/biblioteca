from django.contrib import admin
from user.models import User, Prestamo, Historial
# Register your models here.

admin.site.register(User)
admin.site.register(Prestamo)
admin.site.register(Historial)
