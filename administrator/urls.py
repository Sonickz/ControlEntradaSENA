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
    path("admin/devices/editdevice/<int:id>", views.edit_dispositivo, name="editdevice"),
    path("admin/sanciones", views.sanciones, name="penaltys"),
    path("admin/sanciones/editsanciones/<int:id>", views.edit_sanciones, name="editsanciones"),
    path("admin/vehiculos", views.vehicles, name="vehiculos"),
    path("admin/vehiculos/editvehiculo/<int:id>", views.edit_vehiculo, name="editvehiculo"),
    path("admin/about", views.about, name="about"),
    path("admin/reports/<str:model>", views.reports, name="reports")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)