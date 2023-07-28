from django.urls import path
from . import views
from django.conf import settings
from django.contrib.staticfiles.urls import static


urlpatterns = [
    path("admin/", views.login_admin, name="login"),
    path("admin/logout", views.logout_admin, name="logout"),
    path("admin/registeradmin/", views.register_admin, name="registeradmin"),
    path("admin/inicio", views.adminpanel, name="adminpanel"),
   

    # urls lista user
    path("admin/users", views.users, name="users"),
    path("admin/users/registeruser/<int:rol>", views.register_user, name="registeruser"),
    path("admin/users/edituser/<int:id>", views.edit_user, name="edituser"),

   


    # urls lista vehiculos
    path("admin/vehicles", views.vehicles, name="vehicles"),
    
    # urls para insertar en usuarios un vehiculo
    path('users/<int:id_user>/vehiculo/registrar/', views.register, name="register"),
    path('usuarios/vehiculos-usuario/<int:id_usuario>', views.user_vehicles, name="user_vehicles"),
    path('vehiculos/eliminar/<int:id>', views.delete_vehicle, name='delete_vehicle'),
    path('vehiculos/editar/<int:vehicle_id>', views.edit_vehicle, name='edit_vehicle'),


# urls lista devices
    path("admin/dispo", views.dispositivos, name="devices"),
  
    #path("dispositivos/crear", views.crear, name="crear")
    #path('users/<int:id_user>/dispo/registrar/', views.register, name="register"),
    #path("usuarios/dispo-usuario/<int:id_usuario>", views.user_dispo, name="user_dispo"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
