from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.core.serializers import serialize
import json
from django.http import HttpResponse
from django.contrib import messages
from django.http import Http404
from django.db.models import Subquery
from administrator.models import *
from administrator.forms import *
from datetime import datetime #Fecha y hora
from openpyxl import Workbook #Generar archivos excel
from io import BytesIO

#Inicio
def index(request):
    # sourcery skip: extract-method, use-fstring-for-concatenation

    #Traer los ingresos que no estan relacionados con una salida
    ingresos = Ingresos.objects.exclude(idingreso__in=Subquery(Salidas.objects.values('ingreso'))) or None 
    #Traer salidas
    salidas = Salidas.objects.all
    #Recibir codigo por GET
    if 'code' in request.GET:
        code = request.GET.get('code')

        #Si el usuario esta registrado
        try:
            #Buscar usuario por su documento
            user = get_object_or_404(Usuarios, documento=code) 

            #Traer todos los datos del usuario
            vehiculos = Vehiculos.objects.filter(usuario=user.idusuario)
            dispositivos = Dispositivos.objects.filter(usuario=user.idusuario)
            rol = user.rol
            DocType = user.tipodocumento 
            centro = user.centro or None
            ficha = user.ficha or None
            FichaName = ficha.nombre if ficha else None
            jornada = ficha.jornada if ficha else None
            
            #Si el usuario toma su foto: Guardarla
            if request.method == 'POST':   
                user.imagen.delete()
                imagen = request.FILES['imagen']
                extension = imagen.name.split('.')[-1].lower()
                filename = f"{code}.{extension}"
                imagen.name = filename                        
                user.imagen = imagen
                user.save()
                return redirect(f"/?code={code}")
                                
            #Si el usuario tiene un ingreso activo, hacer salida
            salida = Ingresos.objects.filter(usuario=user.idusuario).exclude(idingreso__in=Salidas.objects.values('ingreso')).first() or None
            dispositivo_salida = Dispositivos.objects.filter(usuario=user.idusuario, documento__isnull=False).first()

            return render(request, 'index.html',{
                #Para ingreso
                'title': user,          
                'users': user,                
                'DocType': DocType,
                'centro': centro,
                'rol': rol,
                'ficha': ficha,
                'FichaName': FichaName,
                'jornada': jornada,
                'vehiculos': vehiculos,
                'dispositivos': dispositivos,
                #Para salida
                'salida': salida,
                'dispositivo_salida': dispositivo_salida,
                })
        #Si el usuario no existe
        except Http404:
            return redirect('registeruser', code=code)
    
    return render(request, 'index.html', {
        'title': 'Inicio',
        'ingresos': ingresos,
        'salidas': salidas
    })

#Reporte en excel: Tabla ingresos y salidas
def reportAccess(request):

    #Tabla
    datos = Salidas.objects.all()

    #Crear libro
    wb = Workbook()

    #Crear hoja para tabla "ingresos"
    ws_ingresos = wb.active
    ws_ingresos.title = "Ingresos"
    ws_ingresos.append(["IdIngreso", "IdSalida", "Fecha", "Usuario", "Vehiculo", "Dispositivo_Ingreso", "Dispositivo_Salida", "Hora de ingreso", "Hora de Salida"])

    #Llenar tabla "salidas"
    for dato in datos:
        if dato.ingreso:
            ws_ingresos.append([dato.ingreso.idingreso,
                                dato.idsalida, 
                               dato.fecha, 
                               f"{dato.ingreso.usuario.nombres} {dato.ingreso.usuario.apellidos}", 
                               f"{dato.vehiculo.tipo.nombre} {dato.vehiculo.marca.nombre}: {dato.vehiculo.placa}" if dato.vehiculo else "Ninguno",
                               f"{dato.ingreso.dispositivo.tipo.nombre} {dato.ingreso.dispositivo.marca.nombre}: {dato.ingreso.dispositivo.sn}" if dato.ingreso.dispositivo else "Ninguno",
                               f"{dato.dispositivo.tipo.nombre} {dato.dispositivo.marca.nombre}: {dato.dispositivo.sn}" if dato.dispositivo else "Ninguno",
                               dato.ingreso.horaingreso,
                               dato.horasalida])

    # Crear un objeto BytesIO para guardar el archivo en memoria
    output = BytesIO()
    wb.save(output)
    output.seek(0)

    # Configurar la respuesta HTTP para descargar el archivo
    response = HttpResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response["Content-Disposition"] = "attachment; filename=Reporte Ingresos - ControlEntradaSENA V1.3.0.xlsx"

    return response

#Ingreso y salida
def access(request, code):
    #Fecha y hora actuales
    date = datetime.now().strftime("%Y-%m-%d")
    hour = datetime.now().strftime("%H:%M:%S")

    
    
    #Vehiculo elegido
    idvehiculo = request.GET.get('vehicle')
    vehiculo = Vehiculos.objects.get(idvehiculo=idvehiculo) if idvehiculo else None

    #Dispositivo elegido
    iddispositivo = request.GET.get('devices')
    iddispositivo = iddispositivo.split(',')

    
    dispositivo = Dispositivos.objects.get(iddispositivo=iddispositivo[0]) if len(iddispositivo) > 0 and iddispositivo[0] else None
    dispositivo2 = Dispositivos.objects.get(iddispositivo=iddispositivo[1]) if len(iddispositivo) > 1 and iddispositivo[1] else None
    dispositivo3 = Dispositivos.objects.get(iddispositivo=iddispositivo[2]) if len(iddispositivo) > 2 and iddispositivo[2] else None
      
    users = get_object_or_404(Usuarios, documento=code)
    
    

    ingreso = Ingresos.objects.filter(usuario=users.idusuario).exclude(idingreso__in=Salidas.objects.values('ingreso')).first() or None
    
    #Si el usuario ha ingresado: Hacer salida
    if ingreso:
        salida = Salidas.objects.create(fecha=date, ingreso=ingreso, vehiculo=vehiculo, dispositivo=dispositivo, dispositivo2=dispositivo2, dispositivo3=dispositivo3, horasalida=hour)
        status = "Salida"
    #Si el usuario no ha ingresado: Hacer ingreso
    else:
        #Crear ingreso
        ingreso = Ingresos.objects.create(fecha=date, usuario=users, vehiculo=vehiculo, dispositivo=dispositivo, dispositivo2=dispositivo2, dispositivo3=dispositivo3, horaingreso=hour)
        status = "Ingreso"

    return render(request, 'access.html',{
        'title': f'{status} usuario',
        'users': users,
        'ingreso': ingreso,
        'status': status
    })


#Registrar usuario
def registeruser(request, code):
    roles = Roles.objects.all()
    rol = request.GET.get('rol') #Obtener rol a registrar por GET
    initial_data = {'rol': rol, 'documento': code} #Dato predeterminado del rol y documento
    form = RegisterUser(request.POST or None, request.FILES or None, initial=initial_data)

    #Requerir o no campos de formulario segun el rol
    form.fields['centro'].required = rol != "3"
    form.fields['ficha'].required = rol == "2"

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.info(request, "success-user")
        return redirect('index')

    return render(request, 'register/registeruser.html', {
        'title': 'Registrar usuario',
        'rol': rol,
        'roles': roles,
        'form': form
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





