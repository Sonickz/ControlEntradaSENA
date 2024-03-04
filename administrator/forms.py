from django import forms
from django.forms import ModelForm
from administrator.models import *
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
#Fecha y hora
from datetime import datetime
date = datetime.now().strftime("%Y-%m-%d")


#Formulario para registro de usuario
class RegisterUser(ModelForm):
    class Meta:
        model = Usuarios
        fields = "__all__"

    #Campos
    nombres = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '50', 'autofocus': True}))
    apellidos = forms.CharField(widget=forms.TextInput(attrs={'maxlength': '50'}))
    tipodocumento = forms.ModelChoiceField(queryset=DocumentoTipo.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Tipo de documento", label="")
    documento = forms.CharField(widget=forms.TextInput(attrs={'onkeypress': 'return valideNumber(event)', 'readonly': True}))
    telefono = forms.CharField(widget=forms.TextInput(attrs={'class': 'onlynumbers', 'maxlength': '10'}))
    correo = forms.EmailField(widget=forms.TextInput(attrs={'maxlength': '50'}))
    centro = forms.ModelChoiceField(queryset=Centros.objects.all(), widget=forms.Select(attrs={'class': 'form-select'}), empty_label="Centro", label="Centro")
    rol = forms.ModelChoiceField(queryset=Roles.objects.all(), widget=forms.Select(attrs={'class': 'form-select', 'disabled': True}), empty_label="Rol", label="Rol")
    ficha = forms.ModelChoiceField(queryset=Fichas.objects.all(), widget=forms.Select(attrs={'class': 'form-select', 'id': 'single-select-field'}), empty_label="Ficha", label="Ficha")
    
    #Validar nombre
    def clean_nombres(self):
        nombre = self.cleaned_data.get('nombres')
        return nombre.title()
    
    def clean_apellidos(self):
        apellido = self.cleaned_data.get('apellidos')
        return apellido.title()
        


#Formulario para registro de dispositivo         
class RegisterDevice(ModelForm):
    class Meta:
        model = Dispositivos
        fields = "__all__"

    #Campos
    usuario = forms.ModelChoiceField(queryset=Usuarios.objects.all(), widget=forms.HiddenInput())
    sn = forms.CharField(widget=forms.TextInput(attrs={'class': 'upper', 'maxlength': 50}), label="Serial Number")
    tipo = forms.ModelChoiceField(queryset=DispositivosTipo.objects.all(), widget=forms.Select(attrs={'class': 'form-select tipo-dispositivo'}), label="", empty_label="Tipo de dispositivo")
    marca = forms.ModelChoiceField(queryset=DispositivosMarca.objects.all(), widget=forms.Select(attrs={'class': 'form-select marca-dispositivo', 'id': 'single-select-field'}), label="", empty_label="Marca")
    
    def clean_doc(self):
        if doc := self.cleaned_data.get('documento', False):
            extension = doc.name.split('.')[-1].lower()
            if extension not in ['pdf']:
                raise ValidationError("El archivo debe estar en formato PDF.")
            tipo = self.cleaned_data['tipo']
            sn = self.cleaned_data['sn']
            marca = self.cleaned_data['marca']
            filename = f"{tipo}-{marca}-{sn}-{doc.name.split('.')[-1]}"
            doc.name = filename
    

#Formulario para registro de vehiculo
class RegisterVehicle(ModelForm):
    
    YEAR_CHOICES = [(str(year), str(year)) for year in range(2000, 2023 + 1)]
    YEAR_CHOICES.insert(0, ('', 'Selecciona el modelo'))
    class Meta:
        model = Vehiculos
        fields = "__all__"

    #Campos
    usuario = forms.ModelChoiceField(queryset=Usuarios.objects.all(), widget=forms.HiddenInput(attrs={'readonly': True}), label="")
    tipo = forms.ModelChoiceField(queryset=VehiculosTipo.objects.all(), widget=forms.Select(attrs={'class': 'form-select tipo-vehiculo'}), label="", empty_label="Tipo de vehiculo", disabled=True)
    placa = forms.CharField(widget=forms.TextInput(attrs={'class':'upper', 'maxlength': 6, 'autofocus': True}))
    marca = forms.ModelChoiceField(queryset=VehiculosMarca.objects.all(), widget=forms.Select(attrs={'class': 'form-select marca-vehiculo', 'id': 'single-select-field'}), label="", empty_label="Marca")
    modelo = forms.ChoiceField(widget=forms.Select(attrs={'class': 'form-select'}), label="", choices=YEAR_CHOICES)

#==============================================================================================

class RegisterAdmin(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2' ]
