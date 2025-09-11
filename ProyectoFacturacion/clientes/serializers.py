from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ('id', 'nombre', 'tipo_documento', 'numero_documento', 
                  'tipo_ncf', 'direccion', 'telefono', 
                  'email', 'fecha_creacion', 'fecha_actualizacion')
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')

    def validate(self, attrs):
        if 'tipo_documento' not in attrs or not attrs['tipo_documento']:
            attrs['tipo_documento'] = 1
        if 'tipo_ncf' not in attrs or not attrs['tipo_ncf']:
            attrs['tipo_ncf'] = 1   
        if 'telefono' not in attrs or not attrs['telefono']:
            attrs['telefono'] = None
        if 'email' not in attrs or not attrs['email']:
            attrs['email'] = None
        if 'direccion' not in attrs or not attrs['direccion']:
            attrs['direccion'] = None
        return super().validate(attrs)    
    
    