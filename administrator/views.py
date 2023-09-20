from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator, Page
from django.http import HttpResponse
from django.contrib import messages
from .models import *
from .forms import *
from openpyxl import Workbook #Generar archivos excel
from io import BytesIO
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
import json

#Funcion para crear paginacion segun un modelo
def createPagination(request, model, cant):
    paginator = Paginator(model, cant)  # Paginator
    page = request.GET.get('page') # Pagina actual
    pages = paginator.get_page(page) # Enviar el paginator y detectar la actual
    return pages

#=============================================================

#Login admin
@user_passes_test(lambda u: not u.is_authenticated, login_url='adminpanel') #Si el usuario ya esta logeado no va a poder acceder a la pagina de login 
def login_admin(request):  # sourcery skip: use-named-expression

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        admin = authenticate(request, username=username, password=password)
        
        if admin:
            login(request, admin)
            return redirect('adminpanel')
        else:
            messages.error(request, "Usuario o contraseña incorrectos")

    return render(request, 'login.html', {
        'title': 'Iniciar Sesion',
    })

#Logout admin
def logout_admin(request):
    logout(request)
    return redirect('login')

#=============================================================

#AdminPanel
@login_required(login_url="login")
def adminpanel(request):
    return render(request, 'adminpanel.html')

#Ingresos
@login_required(login_url="admin")
def access(request):
    access = Ingresos.objects.all()
    exits = Salidas.objects.all()

    return render(request, "pages/ingresos/access.html", {
        'title': 'Ingresos',
        'access': access,
        'exits': exits
    })

#Lista usuarios
@login_required(login_url="admin")
def users(request):
    model = Usuarios.objects.all().prefetch_related('dispositivos_set').prefetch_related('vehiculos_set')
    users = createPagination(request, model, 100)
    roles = Roles.objects.all()    
        
    return render(request, 'pages/usuarios/users.html', {
        'title': 'Usuarios',
        'users': users,
        'roles': roles
    })

#Registrar usuario
def register_user(request, rol):
    initial = {'rol': rol}
    form = RegisterUser(request.POST or None, request.FILES or None, initial=initial)

    form.fields['centro'].required = rol != 3
    form.fields['ficha'].required = rol == 2
    form.fields['documento'].widget.attrs['readonly'] = False

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, "Se ha registrado correctamente")
        return redirect('users')

    return render(request, 'pages/usuarios/register.html', {
        'title': 'Registrar usuario',
        'form': form,
        'rol': rol,
    })

#Editar usuario
def edit_user(request, id):
    instance = Usuarios.objects.get(idusuario=id)

    form = RegisterUser(request.POST or None, request.FILES or None, instance=instance)

    form.fields['imagen'].required = False
    form.fields['centro'].required = instance.rol != 3
    form.fields['ficha'].required = instance.rol == 2
    form.fields['rol'].required = False

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, "Se ha editado correctamente")
        return redirect('users')

    return render(request, 'pages/usuarios/edit.html', {
        'title': 'Editar usuario',
        'form': form,
    })

#=============================================================

# Lista de dispositivos
@login_required(login_url="admin")
def devices(request):
    
    devices = Dispositivos.objects.all()

    form = RegisterDevice(request.POST or None, request.FILES or None)

    form.fields['sn'].widget.attrs['autofocus'] = True

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, "Se ha registrado correctamente")
        return redirect('dispositivo')
    
    return render(request, 'pages/dispositivos/devices.html', {
        'title': 'Dispositivos',
        'dispositivos': devices,
        'form': form
    })

#Editar dispositivo
def edit_dispositivo(request, id):
    instance = Dispositivos.objects.get(iddispositivo=id)

    form = RegisterDevice(request.POST or None, request.FILES or None, instance= instance)
    if request .method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "se ha editado correctamente")
        return redirect('dispositivo')
        
    return render(request, 'pages/dispositivos/edit.html', {
        'title': 'Editar dispositivo',
        'form': form
    })

#=============================================================

#Vehiculos
@login_required(login_url="admin")
def vehicles(request):
    vehicles = Vehiculos.objects.all()
    
    return render(request, 'pages/vehiculos/vehicles.html', {
        'title': 'Vehiculos',
        'vehicles': vehicles
    })

#Editar vehiculos
def edit_vehiculo(request, id):
    instance=Vehiculos.objects.get(idvehiculo=id)

    form = RegisterVehicle(request.POST or None, request.FILES or None, instance= instance)
    
    if request .method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Vehículo editado correctamente")
        return redirect('vehiculos')
            
    return render(request, 'pages/vehiculos/edit.html', {
         'title': 'Editar Vehiculos',
         'form': form 
    })

#=============================================================

# Lista de dispositivos
@login_required(login_url="admin")
def devices(request):
    
    devices = Dispositivos.objects.all()

    form = RegisterDevice(request.POST or None, request.FILES or None)

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, "Se ha registrado correctamente")
        return redirect('dispositivo')
    
    return render(request, 'pages/dispositivos/devices.html', {
        'title': 'Dispositivos',
        'dispositivos': devices,
        'form': form
    })

#Editar dispositivo
def edit_dispositivo(request, id):
    instance = Dispositivos.objects.get(iddispositivo=id)

    form = RegisterDevice(request.POST or None, request.FILES or None, instance= instance)
    if request .method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "se ha editado correctamente")
        return redirect('dispositivo')
        
    return render(request, 'pages/dispositivos/edit.html', {
        'title': 'Editar dispositivo',
        'form': form
    })



###

#Sanciones
@login_required(login_url="admin")
def sanciones(request):
    sanciones = Sanciones.objects.all()
    
    return render(request, 'pages/sanciones/sanciones.html', {
        'title': 'Sanciones',
        'penaltys': sanciones
    })



#Editar sanciones

def edit_sanciones(request, id):
    instance=Sanciones.objects.get(idsancion=id)

    form = RegisterSanciones(request.POST or None, request.FILES or None, instance= instance)

    if request .method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "se ha editado correctamente")
        return redirect('sanciones')
            
    return render(request, 'pages/sanciones/edit.html', {
        'title': 'Editar Sanciones',
        'form': form
     })






#acerda de
@login_required(login_url="admin")
def about(request):
    
    return render(request, 'pages/acerca/about.html', {
        'title': 'Acerca de'
    })


#===========================================================================
#Reporte en excel
def reports(request, model):

    #Crear libro
    wb = Workbook()    
    #Crear hoja
    ws_sheet = wb.active
        
    #Reporte de Ingresos y salidas
    if model == "Ingresos":

        reportData(ws_sheet, model) 

        ws_sheet2 = wb.create_sheet(title="Salidas")
        reportData(ws_sheet2, model="Salidas")

                      

    # Crear un objeto BytesIO para guardar el archivo en memoria
    output = BytesIO()
    wb.save(output)
    output.seek(0)

    # Configurar la respuesta HTTP para descargar el archivo
    response = HttpResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response["Content-Disposition"] = f"attachment; filename=Reporte de {model} - ControlEntradaSENA V1.3.0.xlsx"

    return response

def reportData(ws_sheet, model):
    if model == "Ingresos":
        model = Ingresos.objects.all() #Modelo
        ws_sheet.title = "Ingresos activos" #Titulo hoja
        #Columnas
        ws_sheet.append(["Id", "Fecha", "Usuario", "Vehiculo", "Dispositivo", "Hora Ingreso"]) 
        header_cells = ws_sheet["A1:F1"]
        #Llenar hoja
        for ingreso in model:
            ws_sheet.append([ingreso.idingreso,
                    ingreso.fecha,
                    f"{ingreso.usuario.nombres} {ingreso.usuario.apellidos}",
                    f"{ingreso.vehiculo.tipo.nombre} {ingreso.vehiculo.marca.nombre}: {ingreso.vehiculo.placa}" if ingreso.vehiculo else "Ninguno",
                    f"{ingreso.dispositivo.tipo} {ingreso.dispositivo.marca}: #{ingreso.dispositivo.sn}" if ingreso.dispositivo else "Ninguno",
                    ingreso.horaingreso])                    

    elif model == "Salidas":
        model = Salidas.objects.all()
        ws_sheet.title = "Salidas" 
        ws_sheet.append(["Id", "Fecha", "Usuario", "Vehiculo", "Dispositivo", "Hora Ingreso", "Hora Salida" ]) 
        header_cells = ws_sheet["A1:G1"]
        for salida in model:
            ws_sheet.append([salida.idsalida,
                                 salida.fecha,
                                f"{salida.ingreso.usuario.nombres} {salida.ingreso.usuario.apellidos}",
                                f"{salida.vehiculo.tipo.nombre} {salida.vehiculo.marca.nombre}: {salida.vehiculo.placa}" if salida.vehiculo else "Ninguno",
                                f"{salida.dispositivo.tipo} {salida.dispositivo.marca}: #{salida.dispositivo.sn}" if salida.dispositivo else "Ninguno",
                                salida.ingreso.horaingreso,
                                salida.horasalida])
            
    elif model == "Usuarios":
        model = Usuarios.objects.all()
        ws_sheet.title = "Usuarios" 
        ws_sheet.append(["Id", "Nombres", "Apellidos", "Tipo de Documento", "Documento", "Telefono", "Correo", "Centro", "Rol", "Ficha"]) 
        header_cells = ws_sheet["A1:G1"]
        for salida in model:
            ws_sheet.append([salida.idsalida,
                                 salida.fecha,
                                f"{salida.ingreso.usuario.nombres} {salida.ingreso.usuario.apellidos}",
                                f"{salida.vehiculo.tipo.nombre} {salida.vehiculo.marca.nombre}: {salida.vehiculo.placa}" if salida.vehiculo else "Ninguno",
                                f"{salida.dispositivo.tipo} {salida.dispositivo.marca}: #{salida.dispositivo.sn}" if salida.dispositivo else "Ninguno",
                                salida.ingreso.horaingreso,
                                salida.horasalida])
        
    designExcel(header_cells, ws_sheet)
        

def designExcel(header_cells, ws_sheet):
    #Diseño de celdas
    bold_font = Font(bold=True)
    center_alignment = Alignment(horizontal="center", vertical="center")
    header_fill = PatternFill(start_color="C0C0C0", end_color="C0C0C0", fill_type="solid")
    thin_border = Border(left=Side(style="thin"), 
                         right=Side(style="thin"), 
                         top=Side(style="thin"), 
                         bottom=Side(style="thin"))

    #Establecer diseño de encabezado
    for row in header_cells:
        for cell in row:
            cell.font = bold_font
            cell.alignment = center_alignment
            cell.fill = header_fill
            cell.border = thin_border            
    
    # Establecer alineacion de celdas
    for row in ws_sheet.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = center_alignment
            if cell.value:                
                cell.border = thin_border

    # Establecer ancho de columnas
    column_width = 40
    for column in ws_sheet.columns:
        ws_sheet.column_dimensions[column[0].column_letter].width = column_width
        
        
