from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import *
from django.db import connection
from .forms import *
from django.urls import reverse


#Login admin
@user_passes_test(lambda u: not u.is_authenticated, login_url='adminpanel') #Si el usuario ya esta logeado no va a poder acceder a la pagina de login 
def login_admin(request):

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        admin = authenticate(request, username=username, password=password)
        
        if admin is not None:
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

#Registro admin
def register_admin(request):
    form = RegisterForm(request.POST)

    if request.method == 'POST':
        if form.is_valid():
            form.save()
            messages.success(request, "Se ha registrado correctamente")
            return redirect('login')
        
    return render(request, 'register.html', {
        'title': 'Añadir administrador',
        'form': form
    })


#AdminPanel
@login_required(login_url="login")
def adminpanel(request):
    return render(request, 'adminpanel.html')


#Lista usuarios
@login_required(login_url="admin")
def users(request):
    users = Usuarios.objects.all().prefetch_related('dispositivos_set').prefetch_related('vehiculos_set')

    checks = request.POST.get('checks-users')
    if checks:
        checks = checks.split(',')
        Usuarios.objects.filter(idusuario__in=checks).delete()
        messages.success(request, "Se han eliminado los usuarios seleccionados")

    delete = request.POST.get('delete-user')
    if delete:
        Usuarios.objects.filter(idusuario=delete).delete()
        messages.success(request, "Se ha eliminado el usuario")
    
    return render(request, 'pages/usuarios/users.html', {
        'title': 'Usuarios',
        'users': users
    })

def register_user(request, rol):
    initial = {'rol': rol}
    form = RegisterUser(request.POST or None, request.FILES or None, initial=initial)

    form.fields['centro'].required = False if rol == 3 else True
    form.fields['ficha'].required = False if rol != 2 else True

    if request.method == 'POST':
        if form.is_valid():
            form.save()
            messages.success(request, "Se ha registrado correctamente")
            return redirect('users')

    return render(request, 'pages/usuarios/register.html', {
        'title': 'Registrar usuario',
        'form': form,
        'rol': rol,
    })

def edit_user(request, id):
    instance = Usuarios.objects.get(idusuario=id)
    initial = {'imagen': instance.imagen}
    form = RegisterUser(request.POST or None, request.FILES or None, instance=instance, initial=initial)

    form.fields['imagen'].required = False
    form.fields['centro'].required = False if instance.rol == 3 else True
    form.fields['ficha'].required = False if instance.rol != 2 else True

    if request.method == 'POST':
        if form.is_valid():
            form.save()
            messages.success(request, "Se ha editado correctamente")
            return redirect('users')

    return render(request, 'pages/usuarios/edit.html', {
        'title': 'Editar usuario',
        'form': form,
    })




# VIEWS TABLA DE VEHICULO
@login_required(login_url="login")
def vehicles(request):
    vehiculos = Vehiculos.objects.all()
    return render(request, 'pages/vehiculos/vehicles.html', {'vehiculos': vehiculos})



# VIEWS TABLA DE dispo
@login_required(login_url="login")
def dispositivos(request):
    dispositivos = Dispositivos.objects.all()
    return render(request, 'pages/dispositivos/devices.html', {'dispositivos': dispositivos})


# VIEWS regitar en el usuario un vehiculo
@login_required(login_url="login")
def register(request, id_user):
    user = Usuarios.objects.get(idusuario=id_user)
    if request.method == 'POST':
        formvehicle = VehiculoForm(request.POST or None, request.FILES or None)
        if formvehicle.is_valid():
            vehiculo = formvehicle.save(commit=False)
            vehiculo.Usuario = user
            vehiculo.save()
            messages.success(request, 'Registro exitoso')    
            return redirect('vehicles')
    else:
        formvehicle = VehiculoForm()
    return render(request, 'pages/vehiculos/register_vehicle.html',{
        'formvehicle': formvehicle,
        'user': user,
        'title': 'registro vehículo'
    })
    

# Vista de vehiculos registrados de cada usuario y hacer el crud
@login_required(login_url="login")
def user_vehicles(request, id_usuario):
    vehiculos = Vehiculos.objects.filter(Usuario__idusuario=id_usuario)
    return render(request, 'pages/vehiculos/user_vehicles.html', {'vehiculos': vehiculos})

# Vista para editar vehiculo
@login_required(login_url="login")
def edit_vehicle(request, vehicle_id):
    vehiculo = Vehiculos.objects.get(idvehiculo=vehicle_id)
    formulario = VehiculoForm(request.POST or None, request.FILES or None, instance=vehiculo)
    if formulario.is_valid() and request.method == 'POST':
        formulario.save()
        messages.success(request, 'Se ha editado correctamente el vehículo') 
        # Pasa el ID del usuario como argumento en la URL inversa
        
        return redirect('vehicles')
    
    return render(request, 'pages/vehiculos/edit.html', {'formulario': formulario})



# Vista para eliminar vehiculo
@login_required(login_url="login")
def delete_vehicle(request,id):
    vehiculo = Vehiculos.objects.get(idvehiculo=id)
    vehiculo.delete()
    messages.success(request, 'Se ha eliminado correctamente el vehículo')
    return redirect('vehicles')





