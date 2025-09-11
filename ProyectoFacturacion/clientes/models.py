from django.db import models

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    tipo_documento = models.CharField(max_length=100)
    numero_documento = models.IntegerField(unique=True)
    tipo_ncf = models.IntegerField()
    direccion = models.CharField(max_length=100, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(max_length=100, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} ({self.numero_documento})"