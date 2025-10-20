from django.db import models
from core.middleware import get_current_user


class Producto(models.Model):
    codigo = models.CharField(max_length=255, unique=True)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    id_empresa = models.ForeignKey('config.Empresa', on_delete=models.CASCADE, related_name='productos', null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id_empresa_id:
            user = get_current_user()
            if user and hasattr(user, 'empresa') and user.empresa:
                self.id_empresa = user.empresa
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre
