from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.forms import ModelForm
from django.core.exceptions import ValidationError
from django import forms
from .models import Usuarios, Dispositivos, Vehiculos, Sanciones, DocumentoTipo, Centros, Roles, Fichas, DispositivosMarca, DispositivosTipo, VehiculosMarca, VehiculosTipo

class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2' ]

#Formulario para registro de usuario
class RegisterUser(ModelForm):
    class Meta:
        model = Usuarios
        fields = "__all__"

    #Campos
    nombres = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '50', 'autofocus': True}))
    apellidos = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '50'}))
    tipodocumento = forms.ModelChoiceField(queryset=DocumentoTipo.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Tipo de documento", label="")
    documento = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '10', 'onkeypress': 'return valideNumber(event)'}))
    telefono = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '10', 'onkeypress': 'return valideNumber(event)'}))
    centro = forms.ModelChoiceField(queryset=Centros.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Centro", label="")
    rol = forms.ModelChoiceField(queryset=Roles.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Rol", label="Rol", disabled=True)
    ficha = forms.ModelChoiceField(queryset=Fichas.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Ficha", label="")
    imagen = forms.ImageField(widget=forms.FileInput(attrs={'class': 'form-control'}), label="Foto de perfil")

    #Validacion de imagen
    def clean_imagen(self):
        imagen = self.cleaned_data.get('imagen', False)
        documento = self.cleaned_data['documento']
        if imagen:
            # Verifica que la extensión del archivo sea .jpg, .png o jpeg
            extension = imagen.name.split('.')[-1].lower()
            if extension not in ['jpg', 'png', 'jpeg']:
                raise ValidationError("El archivo debe estar en formato JPG o PNG.")
            filename = documento + '.' + imagen.name.split('.')[-1]
            imagen.name = filename
        return imagen
    



    #Formulario para registro de dispositivo
class RegisterDevices(ModelForm):
    class Meta:
        model = Dispositivos
        fields = "__all__"

    #Campos
    iddispositivo  = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '50', 'autofocus': True}))
    marca = forms.ModelChoiceField(queryset=DispositivosMarca.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Marca dispositivo", label="")
    tipo = forms.ModelChoiceField(queryset=DispositivosTipo.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Tipo dispositivo", label="")
    sn = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '10', 'onkeypress': 'return valideNumber(event)'}))
    imagen = forms.ImageField(widget=forms.FileInput(attrs={'class': 'form-control'}), label="Foto del dispositivo")
    documento = forms.FileField(widget=forms.FileInput(attrs={'class': 'form-control'}), label="Documento")
  
# Formulario para el registro de vehículos  
class RegisterVehicles(ModelForm):
    class Meta:
        model = Vehiculos
        fields = "__all__"
        
    #campos
    usuario = forms.ModelChoiceField(queryset=Usuarios.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Propietario", label="Propietario:", disabled=True)
    tipo = forms.ModelChoiceField(queryset=VehiculosTipo.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Tipo vehiculo", label="Tipo de vehículo:")
    placa = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '7'}), label="Placa", disabled=True)
    marca = forms.ModelChoiceField(queryset=VehiculosMarca.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Marca vehículo", label="Marca del vehículo:")
    modelo = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '4'}), label="Modelo:")
    imagen = forms.ImageField(widget=forms.FileInput(attrs={'class': 'form-control'}), label="Foto del Vehículo:")
    
# Formulario para el registro de sanciones
class RegisterSanciones(ModelForm):
    class Meta:
        model = Sanciones
        fields = "__all__"

    idsancion= forms.CharField(widget=forms.TextInput(attrs={'maxlength': '50', 'autofocus': True}))
    vehiculo = forms.ModelChoiceField(queryset =Vehiculos.objects.all(),widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Vehiculos", label="")
    fecha_inicio = forms.DateField(widget=forms.DateInput(attrs={'class': 'form-control'}))  
    fecha_fin = forms.DateField(widget=forms.DateInput(attrs={'class': 'form-control' }), label="Fecha") 
    estado = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '7',}))
    descripcion =forms.CharField(widget=forms.TextInput(attrs={'maxlength': '20',}))