from django.shortcuts import render, redirect, get_object_or_404
from administrator.models import *
from administrator.forms import *
from django.http import Http404
from mainapp.views import actualUrl, AccessOrExit, getUser

#Modulo1
def module1(request):

    #Si se envia un formulario
    if request.method == 'POST':
        code = request.POST.get('code')
        try:
            #Obtener usuario
            ingreso, user = getUser(code, type="module1")
            #Hacer ingreso o salida
            AccessOrExit(request, ingreso, user, vehiculo=None, dispositivo=None)
            return redirect("module1")        
        #Si el usuario no existe redirigir a registro
        except Http404:
            return redirect('registeruser', code=code)

    return render(request, 'PrincipalModule.html', {
        'title': 'Modulo principal'
    })

#Modulo2
def module2(request):

    actualUrl(request)
    #Si se detecta el GET
    if 'code' in request.GET:
        code = request.GET.get('code')                
        try:     
            #Obtener datos del usuario       
            ingreso, user, dispositivos = getUser(code, type="module2")                                    
            #Al enviar el formulario            
            if request.method == 'POST':
                vehiculo = None   
                #Obtener dispositivos           
                dispositivos = request.POST.get('devices').split(',')            
                dispositivos = Dispositivos.objects.filter(iddispositivo__in=dispositivos) if dispositivos else None         
                #Hacer ingreso o salida                           
                AccessOrExit(request, ingreso, user, vehiculo, dispositivos[0])
                return redirect("module2")                

            return render(request, 'SecondaryModule.html', {
                'title': user,
                'users': user,
                'dispositivos': dispositivos,
                'ingreso': ingreso,
            })
        #Si no existe, redireccionar 
        except Http404:            
            return redirect("registeruser", code=code)
        
    return render(request, 'SecondaryModule.html', {
        'title': 'Modulo Secundario'
    })

# Modulo3
def module3(request):

    actualUrl(request)
    #Si se detecta el GET
    if 'code' in request.GET:
        code = request.GET.get('code')                
        try:     
            #Obtener datos del usuario       
            ingreso, user, vehiculos, dispositivos = getUser(code, type="module3")
            
            #Al enviar el formulario
            if request.method == 'POST':
                #Obtener vehiculo
                vehiculo = request.POST.get('vehicle')
                vehiculo = Vehiculos.objects.get(idvehiculo=vehiculo) if vehiculo else None     
                #Obtener dispositivos           
                dispositivos = request.POST.get('devices').split(',')            
                dispositivos = Dispositivos.objects.filter(iddispositivo__in=dispositivos) if dispositivos else None         
                #Hacer ingreso o salida                           
                AccessOrExit(request, ingreso, user, vehiculo, dispositivos[0])
                return redirect("module3")                

            return render(request, 'ThirdModule.html', {
                'title': user,
                'users': user,
                'vehiculos': vehiculos,
                'dispositivos': dispositivos,
                'ingreso': ingreso,
            })
        #Si no existe, redireccionar 
        except Http404:            
            return redirect("registeruser", code=code)

    return render(request, 'SecondaryModule.html', {
        'title': 'Modulo Terciario'
    })

