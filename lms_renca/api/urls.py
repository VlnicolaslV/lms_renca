#LMS/lms_renca/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, MunicipalidadViewSet, ColegioViewSet, AsignaturaViewSet,
    CursoViewSet, TareaViewSet, ForoViewSet, AsistenciaViewSet,
    CalificacionViewSet, RecursoViewSet, ComentarioViewSet, RespuestaTareaViewSet
)

# Configuración del router
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'municipalidades', MunicipalidadViewSet)
router.register(r'colegios', ColegioViewSet)
router.register(r'asignaturas', AsignaturaViewSet)
router.register(r'cursos', CursoViewSet)
router.register(r'tareas', TareaViewSet)
router.register(r'foros', ForoViewSet)
router.register(r'asistencias', AsistenciaViewSet)
router.register(r'calificaciones', CalificacionViewSet)
router.register(r'recursos', RecursoViewSet)
router.register(r'comentarios', ComentarioViewSet)
router.register(r'respuestas', RespuestaTareaViewSet, basename='respuesta_tarea')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]
