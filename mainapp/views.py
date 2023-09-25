from django.shortcuts import render, redirect, get_object_or_404
from administrator.models import *
from administrator.forms import *
from django.contrib import messages
from django.http import JsonResponse

#Capturar url actual
def actualUrl(request):
    url = request.get_full_path()
    request.session['url'] = url
    return url

#Url ya guardada
def savedUrl(request):
    url = request.session.get('url')
    return url

#Funcion para traer datos del usuario
def getUser(code, type):
    #Usuario
    user = get_object_or_404(Usuarios, documento=code) 
    vehiculos = Vehiculos.objects.filter(usuario=user.idusuario)
    dispositivos = Dispositivos.objects.filter(usuario=user.idusuario)    
    #Si el usuario tiene un ingreso activo
    ingreso = Ingresos.objects.filter(usuario=user.idusuario).exclude(idingreso__in=Salidas.objects.values('ingreso')) or None    
    ingreso = ingreso[0] if ingreso else None
    #Dispositivos con los que ingreso el usuario
    dispositivos_ingreso = IngresosDispositivos.objects.filter(ingreso=ingreso.idingreso) if ingreso else None

    #Dependiendo del modulo retornar
    if type == "module1":
        return ingreso, user
    elif type == "module2":
        return ingreso, user, dispositivos, dispositivos_ingreso
    elif type == "module3":
        return ingreso, user, vehiculos, dispositivos, dispositivos_ingreso

#Funcion para ingresos o salidas
def AccessOrExit(request, ingreso, user, vehiculo, dispositivos):
    date = datetime.now().strftime("%Y-%m-%d")
    hour = datetime.now().strftime("%H:%M:%S")

    #Si el usuario ha ingresado: Hacer salida
    if ingreso:
        salida = Salidas.objects.create(fecha=date, ingreso=ingreso, vehiculo=vehiculo, horasalida=hour)        
        if dispositivos:
            for dispositivo in dispositivos:
                SalidasDispositivos.objects.create(salida=salida, dispositivo=dispositivo)
        status = "Salida"
        messages.success(request, "success-exit")

    #Si el usuario no ha ingresado: Hacer ingreso
    else:
        ingreso = Ingresos.objects.create(fecha=date, usuario=user, vehiculo=vehiculo, horaingreso=hour)
        if dispositivos:
            for dispositivo in dispositivos:            
                IngresosDispositivos.objects.create(ingreso=ingreso, dispositivo=dispositivo)
        status = "Ingreso"
        messages.success(request, "success-access")
    
#Funcion para validar que el dispositivo de salida coincida con el de ingreso  
def compDevice(device, type, ingreso, user):  
    if type == 1:
        try:
            device = Dispositivos.objects.get(usuario=user, sn=device.upper())
            return JsonResponse({'response': {'status': 'success', 'message': 'El dispositivo esta registrado', 'device':{'id': device.iddispositivo, 'user': device.usuario.nombres, 'type': device.tipo.nombre, 'mark': device.marca.nombre, 'sn': device.sn}}})
        except:                
            return JsonResponse({'response': {'status': 'error', 'message': 'El dispositivo no esta registrado'}})
    elif type == 2: 
        try:
            device = Dispositivos.objects.get(sn=device.upper())
            exit_device = IngresosDispositivos.objects.get(ingreso=ingreso.idingreso, dispositivo=device)
            return JsonResponse({'response': {'status': 'success', 'message': 'El dispositivo coincide', 'device':{'id': device.iddispositivo, 'user': device.usuario.nombres, 'type': device.tipo.nombre, 'mark': device.marca.nombre, 'sn': device.sn}}})
        except:                
            return JsonResponse({'response': {'status': 'error', 'message': 'El dispositivo no coincide'}})
#===================================================================================================

#Inicio
def index(request):
    return render(request, "index.html", {
        'title': 'Inicio',
    })

#Registrar usuario
def registeruser(request, code):
        
    rol = request.GET.get('rol') #Obtener rol a registrar por GET    
    rol_selected = Roles.objects.get(idrol=rol) if rol else None #Rol seleccionado
    initial_data = {'rol': rol, 'documento': code} #Dato predeterminado del rol y documento
    form = RegisterUser(request.POST or None, request.FILES or None, initial=initial_data)

    #Requerir o no campos de formulario segun el rol
    form.fields['centro'].required = rol != "3"
    form.fields['ficha'].required = rol == "2"    

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.info(request, "success-user")
        url = savedUrl(request)
        return redirect(url)

    return render(request, 'register/registeruser.html', {
        'title': 'Registrar usuario',
        'rol': rol,
        'rol_selected': rol_selected,
        'form': form
    })

#===================================================================================================

#Registrar vehiculo
def registervehicle(request, code):
    users = Usuarios.objects.get(documento=code)
    #Tipo vehiculo
    vehicle = request.GET.get('vehicle')
    type = request.GET.get('type')
    
    if type:
        options = VehiculosMarca.objects.filter(tipo=type)        
        options_list = [{'id': option.idmarcavehiculo, 'marca': option.nombre} for option in options]        
        return JsonResponse({'options': options_list})
    
    #Tipo vehiculo y usuario predeterminados
    initial_data = {'tipo': vehicle, 'usuario': users.idusuario}

    form = RegisterVehicle(request.POST or None, request.FILES or None, initial=initial_data)

    form.fields['placa'].required = vehicle != "3"
    form.fields['modelo'].required = vehicle != "3"

    if request.method == 'POST' and form.is_valid():
        form.save()        
        messages.info(request, "success-vehicle")
        url = savedUrl(request)
        return redirect(url)

    return render(request, 'register/registervehicle.html',{
        'title': 'Registrar Vehiculo',
        'vehicle': vehicle,
        'form': form,
        'users': users
    })

#===================================================================================================

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
        url = savedUrl(request)
        return redirect(url)

    return render(request, 'register/registerdevice.html',{
        'title': 'Registrar Dispositivo',
        'form': form,
        'doc': doc
    })