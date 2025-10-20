from rest_framework import serializers
from django.db import transaction
from .models import TipoComprobante, Comprobante, SerieComprobante

class TipoComprobanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComprobante
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class ComprobanteSerializer(serializers.ModelSerializer):
    tipo_comprobante_obj = TipoComprobanteSerializer(source='tipo_comprobante', read_only=True)
    
    class Meta:
        model = Comprobante
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'numero_comprobante_completo']
    
    def to_representation(self, instance):
        """Personalizar la representación para devolver el objeto completo del tipo de comprobante"""
        representation = super().to_representation(instance)
        # Reemplazar el ID con el objeto completo en las respuestas
        if instance.tipo_comprobante:
            representation['tipo_comprobante'] = TipoComprobanteSerializer(instance.tipo_comprobante).data
        return representation

    def create(self, validated_data):
        instance = super().create(validated_data)
        self._generar_numero_completo(instance)
        return instance

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        self._generar_numero_completo(instance)
        return instance

    def _generar_numero_completo(self, instance):
        longitud_total = 11
        tipo_texto = instance.tipo_comprobante.tipo_comprobante
        numero_con_ceros = str(instance.numero_comprobante).zfill(longitud_total - len(tipo_texto))
        instance.numero_comprobante_completo = tipo_texto + numero_con_ceros
        instance.save()

class SerieComprobanteSerializer(serializers.ModelSerializer):
    tipo_comprobante_obj = TipoComprobanteSerializer(source='tipo_comprobante', read_only=True)
    tiene_comprobantes_generados = serializers.SerializerMethodField()
    
    class Meta:
        model = SerieComprobante
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'anulado', 'id_empresa']
    
    def to_representation(self, instance):
        """Personalizar la representación para devolver el objeto completo del tipo de comprobante"""
        representation = super().to_representation(instance)
        # Reemplazar el ID con el objeto completo en las respuestas
        if instance.tipo_comprobante:
            representation['tipo_comprobante'] = TipoComprobanteSerializer(instance.tipo_comprobante).data
        return representation

    def get_tiene_comprobantes_generados(self, obj):
        """Verifica si la serie ya tiene comprobantes generados"""
        if obj.id:
            return Comprobante.objects.filter(
                tipo_comprobante=obj.tipo_comprobante,
                numero_comprobante__gte=obj.desde if obj.desde else 0,
                numero_comprobante__lte=obj.hasta if obj.hasta else 0
            ).exists()
        return False

    def validate(self, data):
        # Validar que desde sea menor que hasta
        if data.get('desde') and data.get('hasta'):
            if data['desde'] >= data['hasta']:
                raise serializers.ValidationError("El campo 'desde' debe ser menor que 'hasta'")
        
        # Si estamos actualizando (hay instancia), verificar si ya tiene comprobantes generados
        if self.instance:
            # Verificar si ya hay comprobantes generados para esta serie
            comprobantes_existentes = Comprobante.objects.filter(
                tipo_comprobante=self.instance.tipo_comprobante,
                numero_comprobante__gte=self.instance.desde if self.instance.desde else 0,
                numero_comprobante__lte=self.instance.hasta if self.instance.hasta else 0
            ).exists()
            
            if comprobantes_existentes:
                # Solo permitir actualizar ciertos campos
                campos_modificables = ['fecha_vencimiento', 'numero_actual']
                campos_modificados = [key for key in data.keys() if key not in campos_modificables]
                
                if campos_modificados:
                    raise serializers.ValidationError(
                        f"No se puede modificar una serie de comprobante que ya tiene comprobantes generados. "
                        f"Solo se pueden modificar: {', '.join(campos_modificables)}"
                    )
        
        return data

    def create(self, validated_data):
        # Usar transacción para asegurar atomicidad
        with transaction.atomic():
            # Crear la serie de comprobante
            serie = super().create(validated_data)
            
            # Generar comprobantes individuales desde 'desde' hasta 'hasta'
            for numero in range(serie.desde, serie.hasta + 1):
                # Generar el número de comprobante completo
                longitud_total = 10
                tipo_texto = serie.tipo_comprobante.tipo_comprobante
                numero_con_ceros = str(numero).zfill(longitud_total - len(tipo_texto))
                numero_completo = tipo_texto + numero_con_ceros
                
                # Crear el comprobante directamente
                Comprobante.objects.create(
                    tipo_comprobante=serie.tipo_comprobante,
                    numero_comprobante=numero,
                    numero_comprobante_completo=numero_completo,
                    fecha_emision=serie.fecha_creacion.date(),
                    fecha_vencimiento=serie.fecha_vencimiento,
                    anulado=False
                )
            
            return serie



