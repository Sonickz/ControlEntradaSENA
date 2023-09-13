from django.shortcuts import render, redirect, get_object_or_404
from administrator.models import *
from administrator.forms import *
from django.http import JsonResponse
from django.contrib import messages
from django.http import Http404
#Fecha y hora
from datetime import datetime 

# Modulo2
def index(request):

    #Si se detecta el GET
    if 'code' in request.GET:
        code = request.GET.get('code')
        
        #Si el usuario existe
        try:
            #Usuario
            user = get_object_or_404(Usuarios, documento=code) 
            vehiculos = Vehiculos.objects.filter(usuario=user.idusuario)
            dispositivos = Dispositivos.objects.filter(usuario=user.idusuario)
            
            date = datetime.now().strftime("%Y-%m-%d")
            hour = datetime.now().strftime("%H:%M:%S")

             #Si el usuario tiene un ingreso activo, hacer salida
            salida = Ingresos.objects.filter(usuario=user.idusuario).exclude(idingreso__in=Salidas.objects.values('ingreso')).first() or None

            return render(request, 'SecondaryModule.html', {
                'title': user,
                'users': user,
                'vehiculos': vehiculos,
                'dispositivos': dispositivos,
                'salida': salida,
            })
        #Si no existe, redireccionar 
        except Http404:
            return redirect('registeruser', code=code)

    return render(request, 'SecondaryModule.html', {
        'title': 'Modulo Secundario'
    })

