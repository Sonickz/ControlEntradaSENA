from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r"accessdevices", IngresosDispositivosViewSet)
router.register(r"exitdevices", SalidasDispositivosViewSet)
router.register(r"users", UsuariosViewSet)

urlpatterns = [
    path("api/", include(router.urls))
]
