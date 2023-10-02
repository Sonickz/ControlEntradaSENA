from django.db.models import Q
from administrator.models import *
from .serializers import *
from rest_framework import viewsets, pagination
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
    queryset = Usuarios.objects.all().prefetch_related("vehiculos_set").prefetch_related("dispositivos_set")
    serializer_class = UsuariosSerializer
    pagination_class = pagination.PageNumberPagination

    def getData(self, queryset, type):
        data = []
        vehiculos = []
        dispositivos = []
        for usuario in queryset:
            for vehiculo in usuario.vehiculos_set.all():
                vehiculos.append({
                    "id": vehiculo.idvehiculo,
                    "tipo": vehiculo.tipo.nombre,
                    "placa": vehiculo.placa,
                    "marca": vehiculo.marca.nombre,
                    "modelo": vehiculo.modelo
                })
            for dispositivo in usuario.dispositivos_set.all():
                dispositivos.append({
                    "id": dispositivo.iddispositivo,
                    "tipo": dispositivo.tipo.nombre,
                    "marca": dispositivo.marca.nombre,
                    "sn": dispositivo.sn
                })
            
            if type == "all":
                data.append({
                "id": usuario.idusuario,
                "nombres": usuario.nombres,
                "apellidos": usuario.apellidos,
                "tipodocumento": usuario.tipodocumento.idtipodocumento,
                "documento": usuario.documento,
                "telefono": usuario.telefono,
                "correo": usuario.correo,
                "centro": usuario.centro.idcentro,
                "rol": usuario.rol.nombre,
                "ficha": usuario.ficha.idficha if usuario.ficha else None,
                "vehiculos": vehiculos,
                "dispositivos": dispositivos
            })
            elif type == "query":
                data = {
                "id": usuario.idusuario,
                "nombres": usuario.nombres,
                "apellidos": usuario.apellidos,
                "tipodocumento": usuario.tipodocumento.idtipodocumento,
                "documento": usuario.documento,
                "telefono": usuario.telefono,
                "correo": usuario.correo,
                "centro": usuario.centro.idcentro,
                "rol": usuario.rol.nombre,
                "ficha": usuario.ficha.idficha if usuario.ficha else None,
                "vehiculos": vehiculos,
                "dispositivos": dispositivos
            }

        response = {
            "response": {
                "status": "success",
                "data": data
            }
        }
        return response

    def list (self, request, *args, **kwargs):
        queryset = self.get_queryset()
        queryset = self.paginate_queryset(queryset)

        response = self.getData(queryset, type="all")
        
        return self.get_paginated_response(response)

    def retrieve(self, request, pk=None):
        queryset = Usuarios.objects.filter(Q(idusuario=pk) | Q(documento=pk)).prefetch_related("vehiculos_set").prefetch_related("dispositivos_set")
        
        try:
            response = self.getData(queryset, type="query")       
            return Response(response)
        except:
            return Response({"detail": "No se encontró el usuario."}, status=404)
        
class RolesViewSet(viewsets.ModelViewSet):
    queryset = Roles.objects.all()
    serializer_class = RolesSerializer

class DocumentoTipoViewSet(viewsets.ModelViewSet):
    queryset = DocumentoTipo.objects.all()
    serializer_class = DocumentoTipoSerializer

class CentroViewSet(viewsets.ModelViewSet):
    queryset = Centros.objects.all()
    serializer_class = CentroSerializer

class FichasViewSet(viewsets.ModelViewSet):
    queryset = Fichas.objects.all()
    serializer_class = FichasSerializer