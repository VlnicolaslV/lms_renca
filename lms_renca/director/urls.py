from django.urls import path
from . import views

urlpatterns = [
    path('colegios/', views.colegios, name='colegios'),
    path('cursos/', views.cursos, name='cursos'),
    path('profesores/', views.profesores, name='profesores'),
    path('estudiantes/', views.estudiantes, name='estudiantes'),
    path('asignaturas/', views.asignaturas, name='asignaturas'),
    path('crear_profesor/', views.crear_profesor, name='crear_profesor'),
    path('obtener_colegio_director/', views.obtener_colegio_director, name='obtener_colegio_director'),
    path('crear_curso/', views.crear_curso, name='crear_curso'),
    path('crear-asignatura/', views.crear_asignatura, name='crear_asignatura'),
    path('crear_estudiante/', views.crear_estudiante, name='crear_estudiante'),
    path('todos_profesores/', views.todos_profesores1, name='todos_profesores'),
    path('crear-inscripcion/', views.crear_inscripcion_view, name='crear_inscripcion'),
    path('estudiantes/', views.estudiantes_del_colegio, name='estudiantes_del_colegio'),
    path('promedio-calificaciones/', views.promedio_calificaciones, name='promedio_calificaciones'),
    path('calificaciones-data/', views.calificaciones_data, name='calificaciones_data'),
    path('asistencia-data/', views.asistencia_data, name='asistencia_data'),
    path('estudiantes-mas-asistencias/', views.estudiantes_con_mas_asistencias, name='estudiantes_mas_asistencias'),
    path('estudiantes-mas-inasistencias/', views.estudiantes_con_mas_inasistencias, name='estudiantes_mas_inasistencias'),
    path('inscripciones/', views.obtener_inscripciones, name='inscripciones'),
    path('calificaciones/', views.obtener_calificaciones, name='calificaciones'),
    path('asistencias/', views.obtener_asistencias, name='asistencias'),
    path('datos-periodo/', views.calcular_datos_periodo, name='datos_periodo'),
    path('procesar-asistencia/', views.procesar_asistencia_df, name='procesar_asistencia'),
    path('procesar-calificaciones/', views.procesar_calificaciones_df, name='procesar_calificaciones'),
]

