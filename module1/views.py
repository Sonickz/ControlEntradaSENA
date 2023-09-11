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
from openpyxl import Workbook #Generar archivos excel
from io import BytesIO
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side



def index(request):

    #Si se envia un formulario
    if request.method == 'POST':
        code = request.POST.get('code')

        try:
            # Buscar usuario por su documento
            user = get_object_or_404(Usuarios, documento=code)
            #Buscar ingreso del usuario
            ingreso = Ingresos.objects.filter(usuario=user.idusuario).exclude(idingreso__in=Salidas.objects.values('ingreso')).first() or None
            #Fecha y hora
            date = datetime.now().strftime("%Y-%m-%d")
            hour = datetime.now().strftime("%H:%M:%S")

            #Si el usuario ha ingresado: Hacer salida
            if ingreso:
                salida = Salidas.objects.create(fecha=date, ingreso=ingreso, horasalida=hour)
                status = "Salida"
                messages.success(request, "success-exit")
            #Si el usuario no ha ingresado: Hacer ingreso
            else:
                #Crear ingreso
                ingreso = Ingresos.objects.create(fecha=date, usuario=user,  horaingreso=hour)
                status = "Ingreso"
                messages.success(request, "success-access")

        #Si el usuario no existe redirigir a registro
        except Http404:
            return redirect('registeruser', code=code)

    return render(request, 'PrincipalModule.html', {
        'title': 'Modulo principal'
    })
