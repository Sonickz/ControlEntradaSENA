from django.urls import path
from . import views

urlpatterns = [
    path("module1/", views.index, name="module1")
]
