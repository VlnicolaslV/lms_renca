from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), 
    path('api/usuario/', include('usuario.urls')),
    path('api/director/', include('director.urls')),  # Incluye las URLs de la aplicación director
    path('api/profesor/', include('profesor.urls')),  # Incluye las URLs de la aplicación profesor
    path('api/estudiante/', include('estudiante.urls')),  # Incluye las URLs de la aplicación estudiante
    path('api/municipalidad/', include('municipalidad.urls')),  # Incluye las URLs de la aplicación municipalidad
    path('', RedirectView.as_view(url='/api/usuario/login/', permanent=False), name='index'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
