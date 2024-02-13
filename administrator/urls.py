from django.urls import path, include
from . import views
from django.conf import settings
from django.contrib.staticfiles.urls import static

urlpatterns = [
    path("login/", views.login_admin, name="login"),
    path("admin/logout", views.logout_admin, name="logout"),
    path("admin/inicio", views.adminpanel, name="adminpanel"),
    path("admin/access", views.access, name="access"),
    path("admin/users", views.users, name="users"),
    path("admin/users/registeruser/<str:rol>", views.register_user, name="registeruser"),
    path("admin/users/edituser/<int:id>", views.edit_user, name="edituser"),
    path("admin/devices", views.devices, name="devices"),
    path("admin/devices/editdevice/<int:id>", views.edit_device, name="editdevice"),
    path("admin/vehicles", views.vehicles, name="vehicles"),
    path("admin/vehicles/editvehicle/<int:id>", views.edit_vehicle, name="editvehicle"),
    path("admin/sanciones", views.sanciones, name="penaltys"),
    path("admin/sanciones/editsanciones/<int:id>", views.edit_sanciones, name="editsanciones"),
    path("admin/about", views.about, name="about"),
    path("admin/registeradmin", views.register_admin, name="registeradmin"),
    path("admin/reports/<str:model>", views.reports, name="reports"),
    path("admin/informacion/", views.informacion_view, name="informacion"),
    path("admin/integrantes/", views.integrantes_view, name="integrantes"),
    path("admin/lideres/", views.lideres_view, name="lideres"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)