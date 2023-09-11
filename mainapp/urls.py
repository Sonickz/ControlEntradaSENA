from django.urls import path
from . import views
from django.conf import settings
from django.contrib.staticfiles.urls import static

urlpatterns = [
    path("", views.index, name="index"),
    path("registeruser/<str:code>/", views.registeruser, name="registeruser"),
]
