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