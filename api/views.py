from django.db.models import Q
from administrator.models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.response import Response

class IngresosDispositivosViewSet(viewsets.ModelViewSet):
    queryset = IngresosDispositivos.objects.all()
    serializer_class = IngresosDispositivosSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        for ingreso in queryset:
            data.append({            
                "id": ingreso.idingresodispositivo,
                "idingreso": ingreso.ingreso.idingreso,
                "device": {
                    "id": ingreso.dispositivo.iddispositivo,
                    "type": ingreso.dispositivo.tipo.nombre,
                    "mark": ingreso.dispositivo.marca.nombre,
                    "sn": ingreso.dispositivo.sn
                }                
            })
        response = {
            "response": {
                "status": "success",
                "data": {
                    "devices": data
                }

            }
        }
        return Response(response)

    def retrieve(self, request, pk=None):
        # Buscar todos los objetos que coincidan con el valor de "ingreso"
        queryset = IngresosDispositivos.objects.filter(ingreso=pk)

        if queryset.exists():
            data = []
            for ingreso in queryset:
                data.append({
                    "id": ingreso.idingresodispositivo,
                    "idingreso": ingreso.ingreso.idingreso,
                    "device": {
                        "id": ingreso.dispositivo.iddispositivo,
                        "type": ingreso.dispositivo.tipo.nombre,
                        "mark": ingreso.dispositivo.marca.nombre,
                        "sn": ingreso.dispositivo.sn
                    }
                })

            response_data = {
                "response": {
                    "status": "success",
                    "data": data  # La lista data no está anidada
                }
            }
            return Response(response_data)
        else:
            response_data = {
                "response": {
                    "status": "error",
                    "message": "No se ha encontrado el ingreso"
                }
            }
            return Response(response_data, status=404)
        
class SalidasDispositivosViewSet(viewsets.ModelViewSet):
    queryset = SalidasDispositivos.objects.all()
    serializer_class = SalidasDispositivosSerializer
 

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        for salida in queryset:
            data.append({
                "id": salida.idsalidadispositivo,
                "idsalida": salida.salida.idsalida,
                "device": {
                    "id": salida.dispositivo.iddispositivo,
                    "type": salida.dispositivo.tipo.nombre,
                    "mark": salida.dispositivo.marca.nombre,
                    "sn": salida.dispositivo.sn
                }
            })
        response = {
            "response": {
                "status": "success",
                "data": data
            }
        }
        return Response(response)
    
    def retrieve(self, request, pk=None):
        queryset = SalidasDispositivos.objects.filter(salida=pk)

        if queryset.exists():
            data = []
            for salida in queryset:
                data.append({
                    "id": salida.idsalidadispositivo,
                    "idsalida": salida.salida.idsalida,
                    "device": {
                        "id": salida.dispositivo.iddispositivo,
                        "type": salida.dispositivo.tipo.nombre,
                        "mark": salida.dispositivo.marca.nombre,
                        "sn": salida.dispositivo.sn
                    }
                })
            response = {
                "response": {
                    "status": "success",
                    "data": data
                }
            }
            return Response(response)
        else:
            response = {
                "response": {
                    "status": "error",
                    "message": "No se ha encontrado la salida"
                }
            }
            return Response(response, status=404)

class UsuariosViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer

    def retrieve(self, request, pk=None):
        queryset = Usuarios.objects.filter(Q(idusuario=pk) | Q(documento=pk))

        try:
            usuario = queryset.get()  # Obtén el usuario si existe
            serializer = self.get_serializer(usuario)
            return Response(serializer.data)
        except Usuarios.DoesNotExist:
            return Response({"detail": "No se encontró el usuario."}, status=404)