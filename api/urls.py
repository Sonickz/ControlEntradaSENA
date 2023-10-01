from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r"accessdevices", IngresosDispositivosViewSet)
router.register(r"exitdevices", SalidasDispositivosViewSet)
router.register(r"users", UsuariosViewSet)
router.register(r"roles", RolesViewSet)
router.register(r"tiposdocumento", DocumentoTipoViewSet)
router.register(r"centros", CentroViewSet)
router.register(r"fichas", FichasViewSet)

urlpatterns = [
    path("api/", include(router.urls))
]
