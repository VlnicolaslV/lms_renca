#LMS/lms_renca/profesor/services.py
from api.models import (
    Usuario, CursoAsignatura, Asignatura, 
    Foro, Recurso, Tarea, Calificacion, 
    Comentario, Inscripcion, Asistencia
)
from api.serializers import CursoAsignaturaSerializer, InscripcionSerializer

from functools import wraps
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.request import Request

 
def require_profesor_role(func):
    """Decorador que valida que el usuario tenga el rol de profesor"""
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        jwt_auth = JWTAuthentication()
        try:
            validated_token = jwt_auth.get_validated_token(request.headers.get('Authorization').split()[1])
            user = jwt_auth.get_user(validated_token)
            if user.rol != 'PROFESOR':
                raise PermissionDenied("El usuario no tiene permisos para realizar esta acción.")
            request.user = user
        except Exception:
            raise PermissionDenied("El usuario no tiene permisos para realizar esta acción.")
        return func(request, *args, **kwargs)
    return wrapper




@require_profesor_role
def obtener_cursos_profesor(request):
    """Obtenemos todos los cursos asignatura en los cuales trabaja el profesor"""
    profesor = request.user  # Asumimos que el usuario autenticado es el profesor
    asignaturas = Asignatura.objects.filter(profesor=profesor)
    cursos_asignatura = CursoAsignatura.objects.filter(asignatura__in=asignaturas)
    serializer = CursoAsignaturaSerializer(cursos_asignatura, many=True)
    return serializer.data


@require_profesor_role
def obtener_CursoAsignatura(request, id_curso_asignatura):
    """obtenemos un CursoAsignatura por su id"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    return curso_asignatura


@require_profesor_role
def obtener_estudiantes_curso(request, id_curso_asignatura):
    """Obtenemos todos los estudiantes inscritos en un curso"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    inscripciones = Inscripcion.objects.filter(curso=curso_asignatura.curso)
    serializer = InscripcionSerializer(inscripciones, many=True)
    return serializer.data


@require_profesor_role
def crear_tareas(request, id_curso_asignatura, titulo, descripcion, fecha_publicacion, fecha_entrega, archivo=None):
    """Creamos una tarea para un curso"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    tarea = Tarea.objects.create(
        curso_asignatura=curso_asignatura,
        titulo=titulo,
        descripcion=descripcion,
        archivo=archivo,
        fecha_publicacion=fecha_publicacion,
        fecha_entrega=fecha_entrega
    )
    return tarea


@require_profesor_role
def obtener_tareas(request, id_curso_asignatura):
    """Obtenemos todas las tareas de un curso asignatura específico"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    tareas = Tarea.objects.filter(curso_asignatura=curso_asignatura)
    return tareas



@require_profesor_role
def calificar_tarea(request, id_tarea, id_estudiante, calificacion):
    """calificamos una tarea de un estudiante"""
    tarea = get_object_or_404(Tarea, id=id_tarea)
    estudiante = get_object_or_404(Usuario, id=id_estudiante)
    calificacion = Calificacion.objects.create(
        tarea=tarea,
        estudiante=estudiante,
        calificacion=calificacion
    )
    return calificacion

@require_profesor_role
def obtener_calificaciones(request, id_tarea):
    """obtenemos todas las calificaciones de una tarea"""
    tarea = get_object_or_404(Tarea, id=id_tarea)
    calificaciones = Calificacion.objects.filter(tarea=tarea)
    return calificaciones

@require_profesor_role
def crear_foro(request, titulo, tema, fecha_creacion, id_curso_asignatura):
    """creamos un foro para una asignatura"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    foro = Foro.objects.create(
        titulo=titulo,
        tema=tema,
        fecha_creacion=fecha_creacion,
        asignatura=curso_asignatura
    )
    return foro



@require_profesor_role
def obtener_foros(request, id_curso_asignatura):
    """obtenemos todos los foros de un curso asignatura"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    foros = Foro.objects.filter(asignatura=curso_asignatura)
    return foros



@require_profesor_role
def comentar_foro(request, id_foro, fecha_cracion, comentario):
    """comentamos un foro"""
    foro = get_object_or_404(Foro, id=id_foro)
    usuario = request.user  # Usamos el usuario del request
    comentario_obj = Comentario.objects.create(
        foro=foro,
        usuario=usuario,
        comentario=comentario,
        fecha_creacion=fecha_cracion  # Añadimos la fecha de creación
    )
    return comentario_obj


@require_profesor_role
def obtener_comentarios(request, id_foro):
    """obtenemos todos los comentarios de un foro"""
    foro = get_object_or_404(Foro, id=id_foro)
    comentarios = Comentario.objects.filter(foro=foro)
    return comentarios

@require_profesor_role
def obtener_asistencias(request, id_curso_asignatura):
    """Obtenemos todas las asistencias de un curso"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    asistencias = Asistencia.objects.filter(asignatura=curso_asignatura)
    return asistencias

@require_profesor_role
def tomar_asistencia(request, id_curso_asignatura, rut_estudiante, fecha, presente):
    """Tomamos la asistencia de un estudiante en un curso"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    estudiante = get_object_or_404(Usuario, rut=rut_estudiante)
    asistencia = Asistencia.objects.create(
        estudiante=estudiante,
        asignatura=curso_asignatura,
        fecha=fecha,
        presente=presente
    )
    return asistencia



@require_profesor_role
def subir_recurso(request, nombre, descripcion, archivo, fecha_creacion, id_curso_asignatura):
    """subimos un recurso a una asignatura"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    recurso = Recurso.objects.create(
        nombre=nombre,
        descripcion=descripcion,
        archivo=archivo,
        fecha_creacion=fecha_creacion,
        asignatura=curso_asignatura
    )
    return recurso


@require_profesor_role
def obtener_recursos(request, id_curso_asignatura):
    """obtenemos todos los recursos de una asignatura"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    recursos = Recurso.objects.filter(asignatura=curso_asignatura)
    return recursos


@require_profesor_role
def ver_resultados_asistencia(request, id_curso_asignatura):
    """obtenemos los resultados de asistencia de un curso y la filtramos por curso , fecha y estudiante"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    asistencias = Asistencia.objects.filter(curso=curso_asignatura.curso)
    return asistencias

@require_profesor_role
def ver_resultados_calificaciones(request, id_curso_asignatura):
    """obtenemos los resultados de calificaciones de un curso y la filtramos por curso , fecha y estudiante"""
    curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura)
    calificaciones = Calificacion.objects.filter(curso=curso_asignatura.curso)
    return calificaciones
