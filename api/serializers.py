from rest_framework import serializers
from administrator.models import *

class IngresosDispositivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngresosDispositivos
        fields = '__all__'

class SalidasDispositivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalidasDispositivos
        fields = '__all__'

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

class DocumentoTipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentoTipo
        fields = '__all__'

class CentroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Centros
        fields = '__all__'

class FichasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fichas
        fields = '__all__'