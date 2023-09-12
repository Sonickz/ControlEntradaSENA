from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("registeruser/<str:code>/", views.registeruser, name="registeruser"),    
    path("registervehicle/<str:code>/", views.registervehicle, name="registervehicle"),
    path("registerdevice/<str:code>/", views.registerdevice, name="registerdevice"),
]
