from django.urls import path
from . import views

urlpatterns = [
    path('module2/', views.index, name='module2'),
    path("registervehicle/<str:code>", views.registervehicle, name="registervehicle"),
    path("registerdevice/<str:code>", views.registerdevice, name="registerdevice"),
    
]
