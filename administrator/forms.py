from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.forms import ModelForm
from django.core.exceptions import ValidationError
from django import forms
from .models import Usuarios, Dispositivos, Vehiculos, Sanciones, DocumentoTipo, Centros, Roles, Fichas

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
    

class VehiculoForm(forms.ModelForm):
    class Meta:
        model = Vehiculos
        fields = ['placa', 'tipo', 'marca', 'modelo', 'imagen']
        widgets = {
            'tipo': forms.Select(attrs={'class': 'form-select custom-focus'}),
            'modelo': forms.TextInput(attrs={'class': 'form-control custom-focus'}),
            'marca': forms.Select(attrs={'class': 'form-select custom-focus'}),
            'imagen': forms.FileInput(attrs={'class': 'form-control custom-focus'}),
            'placa': forms.TextInput(attrs={'class': 'form-control custom-focus'}),
        }


class DispositivosForm(forms.ModelForm):
    class Meta:
        model = Dispositivos
        fields = ['iddispositivo', 'marca', 'tipo', 'sn', 'imagen', 'documento']
        widgets = {
            'iddispositivo': forms.Select(attrs={'class': 'form-select custom-focus'}),
            'sn': forms.FileInput(attrs={'class': 'form-control custom-focus'}),
            'tipo': forms.FileInput(attrs={'class': 'form-control custom-focus'}),
            'marca': forms.Select(attrs={'class': 'form-select custom-focus'}),
            'imagen': forms.TextInput(attrs={'class': 'form-control custom-focus'}),
            'documento': forms.TextInput(attrs={'class': 'form-control custom-focus'}),
        }