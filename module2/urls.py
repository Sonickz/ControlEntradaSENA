from django.urls import path
from . import views

urlpatterns = [
    path('module2/', views.index, name='module2'),
    
]
