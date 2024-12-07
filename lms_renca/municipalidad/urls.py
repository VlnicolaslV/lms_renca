# municipalidad/urls.py

from django.urls import path
from .views import (
    crear_colegio_view,
    crear_director_view,
    obtener_municipalidades_view,
    obtener_colegios_view,
    obtener_directores_view,
    obtener_cursos_view,
    obtener_asignaturas_view,
    obtener_inscripciones_view,
    eliminar_colegio_view,
    obtener_resultados_view,
    obtener_directores_sin_colegio_view
)

urlpatterns = [
    path('colegios/', crear_colegio_view, name='crear_colegio'),
    path('directores/', crear_director_view, name='crear_director'),
    path('directores/sin-colegio/', obtener_directores_sin_colegio_view, name='obtener_directores_sin_colegio'),
    path('municipalidades/', obtener_municipalidades_view, name='obtener_municipalidades'),
    path('colegios/listar/', obtener_colegios_view, name='obtener_colegios'),
    path('directores/listar/', obtener_directores_view, name='obtener_directores'),    
    path('cursos/', obtener_cursos_view, name='obtener_cursos'),
    path('asignaturas/', obtener_asignaturas_view, name='obtener_asignaturas'),
    path('inscripciones/', obtener_inscripciones_view, name='obtener_inscripciones'),
    path('colegios/eliminar/<int:id>/', eliminar_colegio_view, name='eliminar_colegio'),
    path('resultados/', obtener_resultados_view, name='obtener_resultados'),
]
