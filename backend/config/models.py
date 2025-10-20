from django.db import models


class PlanPago(models.Model):
    """Modelo para planes de pago (para implementación futura)"""
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duracion_dias = models.IntegerField(default=30)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'planes_pago'
        verbose_name = 'Plan de Pago'
        verbose_name_plural = 'Planes de Pago'

    def __str__(self):
        return self.nombre


class Empresa(models.Model):
    """Modelo para empresas del sistema"""
    nombre = models.CharField(max_length=200)
    rnc = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    plan = models.ForeignKey(PlanPago, on_delete=models.SET_NULL, null=True, blank=True, related_name='empresas')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'empresas'
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'

    def __str__(self):
        return self.nombre
