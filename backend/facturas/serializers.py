from rest_framework import serializers
from django.db import transaction
from .models import Factura, DetalleFactura, Cotizacion, DetalleCotizacion

class FacturaSerializer(serializers.ModelSerializer):
    detalle_facturas = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )
    ncf_asignado = serializers.SerializerMethodField()
    
    class Meta:
        model = Factura
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'numero_factura']
    
    def get_ncf_asignado(self, obj):
        """Incluir información completa del NCF asignado"""
        if obj.ncf_asignado:
            from comprobantes.serializers import ComprobanteSerializer
            return ComprobanteSerializer(obj.ncf_asignado).data
        return None

    def create(self, validated_data):
        # Extraer detalles si están presentes
        detalle_facturas_data = validated_data.pop('detalle_facturas', [])
        
        # Usar transacción para asegurar atomicidad
        with transaction.atomic():
            # Solo generar número de factura si el estado es "Activa"
            if validated_data.get('estado') == 'Activa':
                ultima_factura = Factura.objects.select_for_update().order_by('-numero_factura').first()
                if ultima_factura and ultima_factura.numero_factura:
                    validated_data['numero_factura'] = ultima_factura.numero_factura + 1
                else:
                    validated_data['numero_factura'] = 1
                
                # Asignar NCF automáticamente si no está asignado
                if not validated_data.get('ncf_asignado'):
                    from comprobantes.models import Comprobante
                    comprobante_disponible = Comprobante.objects.filter(
                        tipo_comprobante=validated_data['tipo_comprobante'],
                        cliente__isnull=True,
                        factura_asignada__isnull=True
                    ).first()
                    
                    if comprobante_disponible:
                        validated_data['ncf_asignado'] = comprobante_disponible
                    else:
                        raise serializers.ValidationError({
                            'ncf_asignado': 'No hay comprobantes disponibles para el tipo de comprobante seleccionado. '
                                           'Debe crear una serie de comprobantes antes de activar la factura.'
                        })
            else:
                # Para otros estados, no asignar número de factura
                validated_data['numero_factura'] = None
            # Si cliente viene como ID, obtener la instancia del cliente
            if 'cliente' in validated_data and isinstance(validated_data['cliente'], int):
                from clientes.models import Cliente
                validated_data['cliente'] = Cliente.objects.get(id=validated_data['cliente'])
            
            # Si tipo_comprobante viene como ID, obtener la instancia del tipo de comprobante
            if 'tipo_comprobante' in validated_data and isinstance(validated_data['tipo_comprobante'], int):
                from comprobantes.models import TipoComprobante
                validated_data['tipo_comprobante'] = TipoComprobante.objects.get(id=validated_data['tipo_comprobante'])
            
            # Crear la factura
            factura = super().create(validated_data)
            
            # Si se asignó un NCF, actualizar el comprobante con la factura y cliente
            if factura.ncf_asignado:
                comprobante = factura.ncf_asignado
                comprobante.factura_asignada = factura
                comprobante.cliente = factura.cliente
                comprobante.save()
                
                # Actualizar numero_actual en la serie de comprobante
                self._actualizar_numero_actual_serie(comprobante)
            
            # Crear los detalles
            for detalle_data in detalle_facturas_data:
                detalle_data['factura'] = factura
                # Si producto viene como ID, obtener la instancia del producto
                if 'producto' in detalle_data and isinstance(detalle_data['producto'], int):
                    from productos.models import Producto
                    detalle_data['producto'] = Producto.objects.get(id=detalle_data['producto'])
                DetalleFactura.objects.create(**detalle_data)
            
            return factura
    
    def update(self, instance, validated_data):
        # Extraer detalles si están presentes
        detalle_facturas_data = validated_data.pop('detalle_facturas', [])
        
        # Usar transacción para asegurar atomicidad
        with transaction.atomic():
            # Si cliente viene como ID, obtener la instancia del cliente
            if 'cliente' in validated_data and isinstance(validated_data['cliente'], int):
                from clientes.models import Cliente
                validated_data['cliente'] = Cliente.objects.get(id=validated_data['cliente'])
            
            # Si tipo_comprobante viene como ID, obtener la instancia del tipo de comprobante
            if 'tipo_comprobante' in validated_data and isinstance(validated_data['tipo_comprobante'], int):
                from comprobantes.models import TipoComprobante
                validated_data['tipo_comprobante'] = TipoComprobante.objects.get(id=validated_data['tipo_comprobante'])
            
            # Si se está cambiando el estado a "Activa" y no tiene número de factura, asignarlo
            if (validated_data.get('estado') == 'Activa' and 
                instance.estado != 'Activa' and 
                not instance.numero_factura):
                ultima_factura = Factura.objects.select_for_update().order_by('-numero_factura').first()
                if ultima_factura and ultima_factura.numero_factura:
                    validated_data['numero_factura'] = ultima_factura.numero_factura + 1
                else:
                    validated_data['numero_factura'] = 1
                
                # Asignar NCF automáticamente si no está asignado
                if not validated_data.get('ncf_asignado') and not instance.ncf_asignado:
                    from comprobantes.models import Comprobante
                    comprobante_disponible = Comprobante.objects.filter(
                        tipo_comprobante=instance.tipo_comprobante,
                        cliente__isnull=True,
                        factura_asignada__isnull=True
                    ).first()
                    
                    if comprobante_disponible:
                        validated_data['ncf_asignado'] = comprobante_disponible
                    else:
                        raise serializers.ValidationError({
                            'ncf_asignado': 'No hay comprobantes disponibles para el tipo de comprobante seleccionado. '
                                           'Debe crear una serie de comprobantes antes de activar la factura.'
                        })
            
            # Actualizar la factura
            factura = super().update(instance, validated_data)
            
            # Si se asignó un NCF, actualizar el comprobante con la factura y cliente
            if factura.ncf_asignado and not factura.ncf_asignado.factura_asignada:
                comprobante = factura.ncf_asignado
                comprobante.factura_asignada = factura
                comprobante.cliente = factura.cliente
                comprobante.save()
                
                # Actualizar numero_actual en la serie de comprobante
                self._actualizar_numero_actual_serie(comprobante)
            
            # Si hay detalles, eliminar los existentes y crear los nuevos
            if detalle_facturas_data:
                DetalleFactura.objects.filter(factura=factura).delete()
                for detalle_data in detalle_facturas_data:
                    detalle_data['factura'] = factura
                    # Si producto viene como ID, obtener la instancia del producto
                    if 'producto' in detalle_data and isinstance(detalle_data['producto'], int):
                        from productos.models import Producto
                        detalle_data['producto'] = Producto.objects.get(id=detalle_data['producto'])
                    DetalleFactura.objects.create(**detalle_data)
            
            return factura
    
    def _actualizar_numero_actual_serie(self, comprobante):
        """
        Actualiza el numero_actual de la serie de comprobante basándose en el número del comprobante usado.
        """
        from comprobantes.models import SerieComprobante
        
        # Buscar la serie de comprobante que contiene este comprobante
        serie = SerieComprobante.objects.filter(
            tipo_comprobante=comprobante.tipo_comprobante,
            desde__lte=comprobante.numero_comprobante,
            hasta__gte=comprobante.numero_comprobante
        ).first()
        
        if serie:
            # Actualizar numero_actual al número del comprobante usado
            serie.numero_actual = comprobante.numero_comprobante
            serie.save()
        

class DetalleFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleFactura
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class CotizacionSerializer(serializers.ModelSerializer):
    detalle_cotizaciones = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Cotizacion
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'numero_cotizacion']
    
    def create(self, validated_data):
        # Extraer detalles si están presentes
        detalle_cotizaciones_data = validated_data.pop('detalle_cotizaciones', [])
        
        # Usar transacción para asegurar atomicidad
        with transaction.atomic():
            # Generar número de cotización automáticamente
            ultima_cotizacion = Cotizacion.objects.select_for_update().order_by('-numero_cotizacion').first()
            if ultima_cotizacion:
                validated_data['numero_cotizacion'] = ultima_cotizacion.numero_cotizacion + 1
            else:
                validated_data['numero_cotizacion'] = 1
            
            # Crear la cotización
            cotizacion = super().create(validated_data)
            
            # Crear los detalles
            for detalle_data in detalle_cotizaciones_data:
                detalle_data['cotizacion'] = cotizacion
                # Si producto viene como ID, obtener la instancia del producto
                if 'producto' in detalle_data and isinstance(detalle_data['producto'], int):
                    from productos.models import Producto
                    detalle_data['producto'] = Producto.objects.get(id=detalle_data['producto'])
                DetalleCotizacion.objects.create(**detalle_data)
            
            return cotizacion
    
    def update(self, instance, validated_data):
        # Extraer detalles si están presentes
        detalle_cotizaciones_data = validated_data.pop('detalle_cotizaciones', [])
        
        # Usar transacción para asegurar atomicidad
        with transaction.atomic():
            # Actualizar la cotización
            cotizacion = super().update(instance, validated_data)
            
            # Si hay detalles, eliminar los existentes y crear los nuevos
            if detalle_cotizaciones_data:
                DetalleCotizacion.objects.filter(cotizacion=cotizacion).delete()
                for detalle_data in detalle_cotizaciones_data:
                    detalle_data['cotizacion'] = cotizacion
                    # Si producto viene como ID, obtener la instancia del producto
                    if 'producto' in detalle_data and isinstance(detalle_data['producto'], int):
                        from productos.models import Producto
                        detalle_data['producto'] = Producto.objects.get(id=detalle_data['producto'])
                    DetalleCotizacion.objects.create(**detalle_data)
            
            return cotizacion

class DetalleCotizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCotizacion
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']
        