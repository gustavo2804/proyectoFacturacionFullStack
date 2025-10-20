from rest_framework import serializers
from django.contrib.auth import get_user_model
from config.models import Empresa

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    # Campos de empresa
    empresa_nombre = serializers.CharField(write_only=True, source='empresa.nombre')
    empresa_rnc = serializers.CharField(write_only=True, source='empresa.rnc')
    empresa_telefono = serializers.CharField(write_only=True, required=False, source='empresa.telefono')
    empresa_direccion = serializers.CharField(write_only=True, required=False, source='empresa.direccion')
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'empresa_nombre', 'empresa_rnc', 'empresa_telefono', 'empresa_direccion'
        ]
    
    def create(self, validated_data):
        # Extraer datos de empresa
        empresa_data = validated_data.pop('empresa', {})
        
        # Crear empresa primero
        empresa = Empresa.objects.create(
            nombre=empresa_data.get('nombre', ''),
            rnc=empresa_data.get('rnc', ''),
            telefono=empresa_data.get('telefono', ''),
            direccion=empresa_data.get('direccion', ''),
        )
        
        # Crear usuario y asignar empresa
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            empresa=empresa
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    empresa_rnc = serializers.CharField(source='empresa.rnc', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'empresa', 'empresa_nombre', 'empresa_rnc']
        
        

