from django.shortcuts import render, redirect
from django.urls import reverse
from administrator.models import *
from administrator.forms import *
from django.contrib import messages

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