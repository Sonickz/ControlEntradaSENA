from django.shortcuts import render, redirect, get_object_or_404
from administrator.models import *
from administrator.forms import *
from django.http import Http404, JsonResponse
from mainapp.views import actualUrl, AccessOrExit, getUser, compDevice, compPrevAccess

#Modulo1
def module1(request):

    actualUrl(request)
    module = 1
    if request.method == 'POST':
        code = request.POST.get('code')
        try:
            #Obtener usuario
            ingreso, user = getUser(code, module) 
            #Comprobar ingreso
            compPrevAccess(request, ingreso, module)
            #Hacer ingreso o salida
            AccessOrExit(request, ingreso, user, vehiculo=None, dispositivos=None)
            return redirect("module1")        
        #Si el usuario no existe redirigir a registro
        except Http404:
            return redirect('registeruser', code=code)
        except ValueError:
            return redirect("module1")

    return render(request, 'PrincipalModule.html', {
        'title': 'Modulo principal'
    })

#Modulo2
def module2(request):

    actualUrl(request)
    module = 2
    code = request.GET.get('code')                
    if code: 
        try:     
            #Obtener datos del usuario       
            ingreso, user, dispositivos, dispositivos_ingreso = getUser(code, module)   
            #
            compPrevAccess(request, ingreso, module)
            #Comprobar dispositivo de salida
            access_device = request.GET.get("accessDevice")
            exit_device = request.GET.get('exitDevice')        
            if access_device:
                return compDevice(access_device, 1, ingreso, user)
            elif exit_device:
                return compDevice(exit_device, 2, ingreso, user=None)
            
            if request.method == 'POST':
                vehiculo = None   
                #Obtener dispositivos           
                dispositivos = request.POST.get('devices').split(',')  
                dispositivos = Dispositivos.objects.filter(iddispositivo__in=dispositivos) if dispositivos else None                                 
                #Hacer ingreso o salida                           
                AccessOrExit(request, ingreso, user, vehiculo, dispositivos)
                return redirect("module2")  
                          
            return render(request, 'SecondaryModule.html', {
                'title': user,
                'users': user,
                'dispositivos': dispositivos,
                'ingreso': ingreso,
                'dispositivos_ingreso': dispositivos_ingreso,
            })
            #Si no existe, redireccionar 
        except Http404:            
            return redirect("registeruser", code=code)
        except ValueError:
            return redirect("module2")
        
    return render(request, 'SecondaryModule.html', {
        'title': 'Modulo Secundario'
    })

# Modulo3
def module3(request):

    actualUrl(request)
    module = 3
    #Si se detecta el GET
    if 'code' in request.GET:
        code = request.GET.get('code')                
        try:     
            #Obtener datos del usuario       
            ingreso, user, vehiculos, dispositivos, dispositivos_ingreso = getUser(code, module)
            #
            compPrevAccess(request, ingreso, module)
            #Comprobar dispositivo de salida
            exit_device = request.GET.get('exitDevice')                 
            access_device = request.GET.get("accessDevice")  
            if access_device:
                return compDevice(access_device, 1, ingreso, user)
            elif exit_device:
                return compDevice(exit_device, 2, ingreso, user=None)
            
            #Al enviar el formulario
            if request.method == 'POST':
                #Obtener vehiculo
                vehiculo = request.POST.get('vehicle')
                vehiculo = Vehiculos.objects.get(idvehiculo=vehiculo) if vehiculo else None     
                #Obtener dispositivos           
                dispositivos = request.POST.get('devices')         
                dispositivos = Dispositivos.objects.filter(iddispositivo__in=dispositivos.split(',')) if dispositivos else None         
                #Hacer ingreso o salida                           
                AccessOrExit(request, ingreso, user, vehiculo, dispositivos)
                return redirect("module3")                

            return render(request, 'ThirdModule.html', {
                'title': user,
                'users': user,
                'vehiculos': vehiculos,
                'dispositivos': dispositivos,
                'ingreso': ingreso,
                'dispositivos_ingreso': dispositivos_ingreso       
            })
        #Si no existe, redireccionar 
        except Http404:            
            return redirect("registeruser", code=code)
        except ValueError:
            return redirect("module3")

    return render(request, 'SecondaryModule.html', {
        'title': 'Modulo Terciario'
    })

