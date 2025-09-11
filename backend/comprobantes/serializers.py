from rest_framework import serializers
from django.db import transaction
from .models import TipoComprobante, Comprobante, SerieComprobante

class TipoComprobanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComprobante
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class ComprobanteSerializer(serializers.ModelSerializer):
    tipo_comprobante = TipoComprobanteSerializer(read_only=True)
    
    class Meta:
        model = Comprobante
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'numero_comprobante_completo']

    def create(self, validated_data):
        instance = super().create(validated_data)
        self._generar_numero_completo(instance)
        return instance

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        self._generar_numero_completo(instance)
        return instance

    def _generar_numero_completo(self, instance):
        longitud_total = 19
        tipo_texto = instance.tipo_comprobante.tipo_comprobante
        numero_con_ceros = str(instance.numero_comprobante).zfill(longitud_total - len(tipo_texto))
        instance.numero_comprobante_completo = tipo_texto + numero_con_ceros
        instance.save()

class SerieComprobanteSerializer(serializers.ModelSerializer):
    tipo_comprobante = TipoComprobanteSerializer(read_only=True)
    
    class Meta:
        model = SerieComprobante
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

    def validate(self, data):
        # Validar que desde sea menor que hasta
        if data.get('desde') and data.get('hasta'):
            if data['desde'] >= data['hasta']:
                raise serializers.ValidationError("El campo 'desde' debe ser menor que 'hasta'")
        return data

    def create(self, validated_data):
        # Usar transacción para asegurar atomicidad
        with transaction.atomic():
            # Crear la serie de comprobante
            serie = super().create(validated_data)
            
            # Generar comprobantes individuales desde 'desde' hasta 'hasta'
            for numero in range(serie.desde, serie.hasta + 1):
                comprobante_data = {
                    'tipo_comprobante': serie.tipo_comprobante.id,  # Usar el ID del tipo de comprobante
                    'numero_comprobante': numero,
                    'fecha_emision': serie.fecha_creacion.date(),
                    'fecha_vencimiento': serie.fecha_vencimiento,
                    'cliente': None  # Se asignará cuando se use el comprobante
                }
                
                # Crear el comprobante individual
                comprobante_serializer = ComprobanteSerializer(data=comprobante_data)
                if comprobante_serializer.is_valid():
                    comprobante_serializer.save()
                else:
                    raise serializers.ValidationError(f"Error al crear comprobante {numero}: {comprobante_serializer.errors}")
            
            return serie



