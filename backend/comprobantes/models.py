from django.db import models
from clientes.models import Cliente
from core.middleware import get_current_user


class TipoComprobante(models.Model):
    tipo_comprobante = models.CharField(max_length=50)
    descripcion = models.TextField()
    id_empresa = models.ForeignKey('config.Empresa', on_delete=models.CASCADE, related_name='tipos_comprobante', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.id_empresa_id:
            user = get_current_user()
            if user and hasattr(user, 'empresa') and user.empresa:
                self.id_empresa = user.empresa
        super().save(*args, **kwargs)

    def __str__(self):
        return self.tipo_comprobante

class Comprobante(models.Model):
    tipo_comprobante = models.ForeignKey(TipoComprobante, on_delete=models.CASCADE)
    numero_comprobante = models.IntegerField()
    numero_comprobante_completo = models.CharField(max_length=20, null=True, blank=True)
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField()
    anulado = models.BooleanField(default=False)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, null=True, blank=True)
    factura_asignada = models.ForeignKey('facturas.Factura', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Factura Asignada")
    id_empresa = models.ForeignKey('config.Empresa', on_delete=models.CASCADE, related_name='comprobantes', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.id_empresa_id:
            user = get_current_user()
            if user and hasattr(user, 'empresa') and user.empresa:
                self.id_empresa = user.empresa
        super().save(*args, **kwargs)


class SerieComprobante(models.Model):
    tipo_comprobante = models.ForeignKey(TipoComprobante, on_delete=models.CASCADE)
    desde = models.IntegerField(verbose_name="Desde" , null=True, blank=True)
    hasta = models.IntegerField(verbose_name="Hasta" , null=True, blank=True)
    numero_actual = models.IntegerField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    fecha_vencimiento = models.DateField()
    anulado = models.BooleanField(default=False, verbose_name="Anulado")
    id_empresa = models.ForeignKey('config.Empresa', on_delete=models.CASCADE, related_name='series_comprobante', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.id_empresa_id:
            user = get_current_user()
            if user and hasattr(user, 'empresa') and user.empresa:
                self.id_empresa = user.empresa
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tipo_comprobante.tipo_comprobante} - {self.desde} al {self.hasta}"
    
    def comprobantes_restantes(self):
        """Calcula cuántos comprobantes quedan disponibles"""
        if not self.desde or not self.hasta:
            return 0
        return max(0, self.hasta - self.numero_actual)
    
    def esta_por_agotarse(self, limite=5):
        """Verifica si quedan menos de 'limite' comprobantes"""
        return self.comprobantes_restantes() <= limite and self.comprobantes_restantes() > 0
    
    def esta_agotado(self):
        """Verifica si no quedan comprobantes disponibles"""
        return self.comprobantes_restantes() == 0