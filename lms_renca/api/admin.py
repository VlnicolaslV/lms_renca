from django.contrib import admin
from .models import Usuario, Municipalidad, Colegio, Asignatura, Curso, Tarea, Foro, Asistencia, Calificacion, Recurso, Comentario, CursoAsignatura, Inscripcion

# Register your models here.
admin.site.register(Usuario)
admin.site.register(Municipalidad)
admin.site.register(Colegio)
admin.site.register(Asignatura)
admin.site.register(Curso)
admin.site.register(Tarea)
admin.site.register(Foro)
admin.site.register(Asistencia)
admin.site.register(Calificacion)
admin.site.register(Recurso)
admin.site.register(Comentario)
admin.site.register(CursoAsignatura)
admin.site.register(Inscripcion)
