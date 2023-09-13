from django.shortcuts import render, redirect
from django.urls import reverse
from administrator.models import *
from administrator.forms import *
from django.contrib import messages
from django.http import JsonResponse, HttpResponseRedirect

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

#Inicio
def index(request):

    return render(request, "index.html", {
        'title': 'Inicio',
    })

#===================================================================================================

#Registrar usuario
def registeruser(request, code):

    #Obtener la url de donde viene
    url_comes = request.META.get('HTTP_REFERER', None)

    #Si existe asignarla a una global
    if url_comes:
        request.session['url_comes'] = url_comes
    
    url = request.session.get('url_comes', None) #Obtener url de donde viene la peticion
        
    rol = request.GET.get('rol') #Obtener rol a registrar por GET
    rol_selected = Roles.objects.get(idrol=rol) if rol else None
    initial_data = {'rol': rol, 'documento': code} #Dato predeterminado del rol y documento
    form = RegisterUser(request.POST or None, request.FILES or None, initial=initial_data)

    #Requerir o no campos de formulario segun el rol
    form.fields['centro'].required = rol != "3"
    form.fields['ficha'].required = rol == "2"

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.info(request, "success-user")
        del request.session['url_comes'] #Eliminar url anterior
        return redirect(url) #Redireccionar

    return render(request, 'register/registeruser.html', {
        'title': 'Registrar usuario',
        'rol': rol,
        'rol_selected': rol_selected,
        'form': form
    })

#===================================================================================================

#Registrar vehiculo
def registervehicle(request, code):
    url = request.GET.get('url')
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
        if url == "module2":
            url = reverse("module2") + f"?code={code}"
            return HttpResponseRedirect(url)
        elif url == "module3":
            return HttpResponseRedirect(url)

    return render(request, 'register/registervehicle.html',{
        'title': 'Registrar Vehiculo',
        'vehicle': vehicle,
        'form': form,
        'users': users, 
        'url': url
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
        redirect = reverse("module2") + f"?code={code}"
        messages.info(request, "success-device")
        return HttpResponseRedirect(redirect)

    return render(request, 'register/registerdevice.html',{
        'title': 'Registrar Dispositivo',
        'form': form,
        'doc': doc
    })