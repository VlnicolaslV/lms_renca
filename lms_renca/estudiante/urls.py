from django.urls import path
from .views import (
    obtener_cursos_y_asignaturas_view,
    obtener_calificaciones,
    obtener_asistencias,
    obtener_recursos_asignatura_view,
    descargar_recursos_view,
    obtener_foros_asignatura_view,
    participar_foro_view,
    comentar_foro_view,
    obtener_comentarios_view,
    ver_notas,
    ver_promedios,
    obtener_tareas_view,
    ver_asistencia,
    promedio_de_asistencia,
    ver_resultados,
    subir_respuesta_view,
    respuestas_view
)

urlpatterns = [
    path('cursos-y-asignaturas/', obtener_cursos_y_asignaturas_view, name='obtener_cursos_y_asignaturas'),
    path('calificaciones/<str:estudiante_rut>/', obtener_calificaciones, name='obtener_calificaciones'),
    path('asistencias/', obtener_asistencias, name='obtener_asistencias'),
    path('recursos-asignatura/<int:asignatura_id>/', obtener_recursos_asignatura_view, name='obtener_recursos_asignatura'),
    path('recursos/<int:recurso_id>/', descargar_recursos_view, name='descargar_recursos'),
    path('foros-asignatura/<int:asignatura_id>/', obtener_foros_asignatura_view, name='obtener_foros_asignatura'),
    path('foro/<int:foro_id>/participar/', participar_foro_view, name='participar_foro'),
    path('foro/<int:foro_id>/comentar/', comentar_foro_view, name='comentar_foro'),
    path('foro/<int:foro_id>/comentarios/', obtener_comentarios_view, name='obtener'),
    path('notas/<str:estudiante_rut>/', ver_notas, name='ver_notas'),
    path('promedios/', ver_promedios, name='ver_promedios'),
    path('tareas/<str:estudiante_rut>/', obtener_tareas_view, name='obtener_tareas'),
    path('respuestas/<str:estudiante_rut>/', respuestas_view, name='respuestas'),
    path('asistencia/', ver_asistencia, name='ver_asistencia'),
    path('promedio-asistencia/', promedio_de_asistencia, name='promedio_de_asistencia'),
    path('resultados/', ver_resultados, name='ver_resultados'),
    path('subir-respuesta/', subir_respuesta_view, name='subir_respuesta')
]
