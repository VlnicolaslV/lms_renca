# LMS/lms_renca/api/views.py
from rest_framework import viewsets
from api.models import Usuario, Municipalidad, Colegio, Asignatura, Curso, Tarea, RespuestaTarea, Foro, Asistencia, Calificacion, Recurso, Comentario
from .serializers import (
    UsuarioSerializer, MunicipalidadSerializer, ColegioSerializer,
    AsignaturaSerializer, CursoSerializer, TareaSerializer,
    ForoSerializer, AsistenciaSerializer, CalificacionSerializer,
    RecursoSerializer, ComentarioSerializer, RespuestaTareaSerializer
)

# ViewSet para Usuario
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

# ViewSet para Municipalidad
class MunicipalidadViewSet(viewsets.ModelViewSet):
    queryset = Municipalidad.objects.all()
    serializer_class = MunicipalidadSerializer

# ViewSet para Colegio
class ColegioViewSet(viewsets.ModelViewSet):
    queryset = Colegio.objects.all()
    serializer_class = ColegioSerializer

# ViewSet para Asignatura
class AsignaturaViewSet(viewsets.ModelViewSet):
    queryset = Asignatura.objects.all()
    serializer_class = AsignaturaSerializer

# ViewSet para Curso
class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    
        

# ViewSet para Tarea
class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
    
class RespuestaTareaViewSet(viewsets.ModelViewSet):
    queryset = RespuestaTarea.objects.all()
    serializer_class = RespuestaTareaSerializer

    def get_queryset(self):
        user = self.request.user
        if user.rol == 'ESTUDIANTE':
            # Los estudiantes solo ven sus propias respuestas
            return RespuestaTarea.objects.filter(estudiante=user)
        elif user.rol in ['PROFESOR', 'DIRECTOR']:
            # Profesores o directores pueden ver todas las respuestas
            return RespuestaTarea.objects.all()
        else:
            # Otros roles (como Administradores) pueden tener restricciones adicionales
            return RespuestaTarea.objects.none()

    def perform_create(self, serializer):
        # Asigna automáticamente al usuario actual como el estudiante que envía la respuesta
        if self.request.user.rol == 'ESTUDIANTE':
            serializer.save(estudiante=self.request.user)
        else:
            raise PermissionError("Solo los estudiantes pueden crear respuestas a tareas.")



# ViewSet para Foro
class ForoViewSet(viewsets.ModelViewSet):
    queryset = Foro.objects.all()
    serializer_class = ForoSerializer

# ViewSet para Asistencia
class AsistenciaViewSet(viewsets.ModelViewSet):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaSerializer

# ViewSet para Calificacion
class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer

# ViewSet para Recurso
class RecursoViewSet(viewsets.ModelViewSet):
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer

# ViewSet para Comentario
class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

