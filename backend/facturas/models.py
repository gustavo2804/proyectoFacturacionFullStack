from django.db import models
from django.core.exceptions import ValidationError
from clientes.models import Cliente
from productos.models import Producto
from comprobantes.models import TipoComprobante, Comprobante

class EstadoFactura(models.TextChoices):
    BORRADOR = 'Borrador'
    PENDIENTE = 'Pendiente'
    ACTIVA = 'Activa'
    PAGADA = 'Pagada'
    ANULADA = 'Anulada'

class Factura(models.Model):
    numero_factura = models.IntegerField(unique=True, null=True, blank=True)
    tipo_comprobante = models.ForeignKey(TipoComprobante, on_delete=models.CASCADE)
    ncf_asignado = models.ForeignKey(Comprobante, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="NCF Asignado")
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField()
    anulado = models.BooleanField(default=False)
    estado = models.CharField(max_length=20, choices=EstadoFactura.choices, default=EstadoFactura.PENDIENTE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        # Validar que existan comprobantes disponibles si se está asignando un NCF
        if self.estado == 'Activa' and not self.ncf_asignado:
            # Verificar si hay comprobantes disponibles para el tipo de comprobante
            comprobantes_disponibles = Comprobante.objects.filter(
                tipo_comprobante=self.tipo_comprobante,
                cliente__isnull=True,  # Comprobantes no asignados a cliente
                factura_asignada__isnull=True  # Comprobantes no asignados a factura
            ).exists()
            
            if not comprobantes_disponibles:
                raise ValidationError({
                    'ncf_asignado': 'No hay comprobantes disponibles para el tipo de comprobante seleccionado. '
                                   'Debe crear una serie de comprobantes antes de activar la factura.'
                })

    def __str__(self):
        return f"Factura {self.numero_factura} - {self.cliente.nombre}" 


class DetalleFactura(models.Model):
    factura = models.ForeignKey(Factura, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    descripcion = models.TextField(blank=True, null=True, help_text="Descripción personalizada del producto")
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Detalle de factura {self.factura.numero_factura} - {self.producto.nombre}"
    
class Cotizacion(models.Model):
    numero_cotizacion = models.IntegerField(unique=True, null=True, blank=True)
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField()
    anulado = models.BooleanField(default=False)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

class DetalleCotizacion(models.Model):
    cotizacion = models.ForeignKey(Cotizacion, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    descripcion = models.TextField(blank=True, null=True, help_text="Descripción personalizada del producto")
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Detalle de cotizacion {self.cotizacion.numero_cotizacion} - {self.producto.nombre}"
