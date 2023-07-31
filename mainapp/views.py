from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import logout
from django.http import Http404
from django.contrib import messages
from django.db.models import Subquery
from administrator.models import Usuarios, Dispositivos, Vehiculos, Sanciones, Ingresos, Fichas, Salidas
from .forms import RegisterUser, RegisterDevice, RegisterVehicle
#Fecha y hora
from datetime import datetime

#Inicio / Ingreso
def index(request):
    ingresos = Ingresos.objects.exclude(idingreso__in=Subquery(Salidas.objects.values('ingreso'))) or None 

    salidas = Salidas.objects.all
    #Si se escanea el codigo de barras
    if 'code' in request.GET:
        code = request.GET.get('code')
        #Si el usuario existe
        try:
            user = get_object_or_404(Usuarios, documento=code)   
            #Si el usuario tiene un ingreso activo 
            ingreso = Ingresos.objects.filter(usuario=user.idusuario).exclude(idingreso__in=Salidas.objects.values('ingreso')).first() or None
            dispositivo_salida = Dispositivos.objects.filter(usuario=user.idusuario, documento__isnull=False).first()

            if request.method == 'POST':
                form = RegisterUser(request.POST, request.FILES)

                form.fields['nombres'].required = False
                form.fields['apellidos'].required = False
                form.fields['tipodocumento'].required = False
                form.fields['documento'].required = False
                form.fields['telefono'].required = False
                form.fields['correo'].required = False
                form.fields['centro'].required = False
                form.fields['rol'].required = False
                form.fields['ficha'].required = False

                if form.is_valid():
                        user.imagen.delete()
                        imagen = form.cleaned_data['imagen']
                        extension = imagen.name.split('.')[-1].lower()
                        filename = f"{code}.{extension}"
                        imagen.name = filename                        
                        user.imagen = imagen
                        user.save()
                        return redirect('/?code=' + code)
                        
            vehiculos = Vehiculos.objects.filter(usuario=user.idusuario)
            dispositivos = Dispositivos.objects.filter(usuario=user.idusuario)
            rol = user.rol
            DocType = user.tipodocumento 
            centro = user.centro or None
            ficha = user.ficha or None
            FichaName = ficha.nombre if ficha else None
            jornada = ficha.jornada if ficha else None

            return render(request, 'index.html',{
                'title': user.nombres,
                'ingreso': ingreso,
                'users': user,
                'dispositivo_salida': dispositivo_salida,
                'DocType': DocType,
                'centro': centro,
                'rol': rol,
                'ficha': ficha,
                'FichaName': FichaName,
                'jornada': jornada,
                'vehiculos': vehiculos,
                'dispositivos': dispositivos,
                })
        #Si el usuario no existe
        except Http404:
            return redirect('registeruser', code=code)
    
    return render(request, 'index.html', {
        'title': 'Inicio',
        'ingresos': ingresos,
        'salidas': salidas
    })

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
    rol = request.GET.get('rol')    
    #Dato predeterminado del rol y documento
    initial_data = {'rol': rol, 'documento': code}
    form = RegisterUser(request.POST or None, request.FILES or None, initial=initial_data)

    #Requerir o no campos de formulario segun el rol
    form.fields['centro'].required = False if rol == "3" else True
    form.fields['ficha'].required = False if rol != "2" else True

    if request.method == 'POST':        
        if form.is_valid():
            form.save()
            return redirect('index')

    return render(request, 'registeruser.html', {
        'title': 'Registrar usuario',
        'rol': rol,
        'form': form
    })


#Registrar vehiculo
def registervehicle(request, code):
    users = Usuarios.objects.get(documento=code)
    #Tipo vehiculo
    vehicle = request.GET.get('vehicle')

    #Si el usuario no es instructor o administrativo no puede registrar carros
    if vehicle == "1" and users.rol.idrol in [2, 3]:
        raise Http404("No estas autorizado a registrar un Vehiculo(Carro).")
    
    #Tipo vehiculo y usuario predeterminados
    initial_data = {'tipo': vehicle, 'usuario': users.idusuario}

    form = RegisterVehicle(request.POST or None, request.FILES or None, initial=initial_data)

    form.fields['placa'].required = False if vehicle == "3" else True
    form.fields['modelo'].required = False if vehicle == "3" else True
    
    if request.method == 'POST':        
        if form.is_valid():
            form.save()
            return redirect(f'/?code={code}')
        
    return render(request, 'registervehicle.html',{
        'title': 'Registrar Vehiculo',
        'vehicle': vehicle,
        'form': form,
        'users': users
    })

#Registrar dispositivo
def registerdevice(request, code):
    doc = request.GET.get('doc')

    users = Usuarios.objects.get(documento=code)
    #Usuario predeterminado
    initial_data = {'usuario': users.idusuario}

    form = RegisterDevice(request.POST or None, request.FILES or None, initial=initial_data)
    if doc:
        form.fields['documento'].required = True
    else:
        form.fields['documento'].required = False
    
    if request.method == 'POST':        
        if form.is_valid():
            form.save()
            return redirect(f'/?code={code}')
        
    return render(request, 'registerdevice.html',{
        'title': 'Registrar Dispositivo',
        'form': form,
        'doc': doc
    })





