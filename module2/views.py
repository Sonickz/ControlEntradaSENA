from django.shortcuts import render, redirect, get_object_or_404
from administrator.models import *
from administrator.forms import *
from django.http import JsonResponse
from django.http import HttpResponse
from django.contrib import messages
from django.http import Http404
from django.db.models import Subquery
#Fecha y hora
from datetime import datetime 
date = datetime.now().strftime("%Y-%m-%d")
hour = datetime.now().strftime("%H:%M:%S")
from openpyxl import Workbook #Generar archivos excel
from io import BytesIO
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

# Modulo2
def index(request):

    if 'code' in request.GET:
        code = request.GET.get('code')
        
        try:
            user = get_object_or_404(Usuarios, documento=code)
            vehiculos = Vehiculos.objects.filter(usuario=user.idusuario)
            dispositivos = Dispositivos.objects.filter(usuario=user.idusuario)
            
             #Si el usuario tiene un ingreso activo, hacer salida
            salida = Ingresos.objects.filter(usuario=user.idusuario).exclude(idingreso__in=Salidas.objects.values('ingreso')).first() or None

            return render(request, 'SecondaryModule.html', {
                'title': user,
                'users': user,
                'vehicles': vehiculos,
                'dispositivos': dispositivos,
                'salida': salida,
            })
        except Http404:
            return redirect('registeruser', code=code)

    return render(request, 'SecondaryModule.html', {
        'title': 'Modulo Secundario'
    })

#Registrar vehiculo
def registervehicle(request, code):
    users = Usuarios.objects.get(documento=code)
    #Tipo vehiculo
    vehicle = request.GET.get('vehicle')

    # if vehicle:
    #     options = VehiculosMarca.objects.filter(tipo=vehicle)
    #     options_list = [{'id': option.idmarcavehiculo, 'marca': option.nombre} for option in options]
    #     return JsonResponse({'options': options_list})

    #Tipo vehiculo y usuario predeterminados
    initial_data = {'tipo': vehicle, 'usuario': users.idusuario}

    form = RegisterVehicle(request.POST or None, request.FILES or None, initial=initial_data)

    form.fields['placa'].required = vehicle != "3"
    form.fields['modelo'].required = vehicle != "3"

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.info(request, "success-vehicle")
        return redirect(f'/?code={code}')

    return render(request, 'register/registervehicle.html',{
        'title': 'Registrar Vehiculo',
        'vehicle': vehicle,
        'form': form,
        'users': users
    })

#Registrar dispositivo
def registerdevice(request, code):
    doc = request.GET.get('doc')
    users = Usuarios.objects.get(documento=code)
    
    selectedType = request.GET.get("selectedType")
    if selectedType:
        options = DispositivosMarca.objects.filter(tipo=selectedType)   
        option_list = [{'id': option.idmarcadispositivo, 'marca': option.nombre} for option in options]
        return JsonResponse({'options': option_list})
    
    
    initial_data = {'usuario': users.idusuario}
    form = RegisterDevice(request.POST or None, request.FILES or None, initial=initial_data)
    form.fields['documento'].required = bool(doc)
    
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.info(request, "success-device")
        return redirect(f'/?code={code}')

    return render(request, 'register/registerdevice.html',{
        'title': 'Registrar Dispositivo',
        'form': form,
        'doc': doc
    })