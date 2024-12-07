import pandas as pd
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, Avg, Q, When, Case, Value, IntegerField
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import PermissionDenied
from django.db.models.functions import TruncYear, TruncMonth, TruncDay, TruncQuarter
from datetime import datetime
from django.http import HttpResponse
from io import StringIO
from functools import wraps
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.serializers import ColegioSerializer
from api.models import (
    Municipalidad, Colegio, Usuario, Curso, Asignatura, Inscripcion, CursoAsignatura, Calificacion, Asistencia
)

def require_municipalidad_role(func):
    """decorador para verificar si el usuario autenticado es un administrador de municipalidad"""
    @wraps(func)
    def _wrapped_view(request, *args, **kwargs):
        jwt_auth = JWTAuthentication()
        try:
            validated_token = jwt_auth.get_validated_token(request.headers.get('Authorization').split()[1])
            user = jwt_auth.get_user(validated_token)
            if user.rol != 'ADMINISTRADOR':
                raise PermissionDenied("El usuario no tiene permisos para realizar esta acción.")
            request.user = user
        except Exception:
            raise PermissionDenied("El usuario no tiene permisos para realizar esta acción.")
        return func(request, *args, **kwargs)
    return _wrapped_view

@require_municipalidad_role
def obtener_municipalidades(request):
    """Obtiene todas las municipalidades registradas en el sistema."""
    municipalidades = Municipalidad.objects.all()
    return {'municipalidades': list(municipalidades.values())}

def obtener_colegios(request):
    """Obtiene todos los colegios asociados a la municipalidad del administrador autenticado en el sistema."""
    return Colegio.objects.filter(municipalidad=request.user.municipalidad)


@require_municipalidad_role
def obtener_directores(request):
    """Obtiene todos los directores asociados a los colegios que están asociados a la municipalidad del administrador autenticado en el sistema."""
    directores = Usuario.objects.filter(colegio__municipalidad=request.user.municipalidad, rol='DIRECTOR')
    return {'directores': list(directores.values())}

@require_municipalidad_role
def obtener_directores_sin_colegio(request):
    """Obtiene todos los directores que no tienen colegio asociado."""
    directores = Usuario.objects.filter(rol='DIRECTOR', colegio__isnull=True)
    return {'directores': list(directores.values())}

@require_municipalidad_role
def obtener_cursos(request):
    """Obtiene todos los cursos asociados a los colegios que están asociados a la municipalidad del administrador autenticado en el sistema."""
    cursos = Curso.objects.filter(colegio__municipalidad=request.user.municipalidad)
    return {'cursos': list(cursos.values())}

@require_municipalidad_role
def obtener_asignaturas(request):
    """Obtiene todas las asignaturas asociadas a los cursos a través de la tabla intermedia CursoAsignatura 
    que están asociados a los colegios que están asociados a la municipalidad del administrador autenticado en el sistema."""
    asignaturas = Asignatura.objects.filter(curso__colegio__municipalidad=request.user.municipalidad)
    return {'asignaturas': list(asignaturas.values())}

@require_municipalidad_role
def obtener_inscripciones(request):
    """Obtiene todas las inscripciones asociadas a los cursos que están asociados a los colegios que están asociados a la municipalidad del administrador autenticado en el sistema."""
    inscripciones = Inscripcion.objects.filter(curso__colegio__municipalidad=request.user.municipalidad)
    return {'inscripciones': list(inscripciones.values())}

@require_municipalidad_role
def crear_director(request, rut, nombre, apellido, direccion, telefono, correo, fecha_nacimiento, password):
    """Función para crear un usuario con rol de director en el sistema."""
    rol = 'DIRECTOR'
    # Creamos el usuario utilizando el UsuarioManager y encriptamos la contraseña
    usuario = Usuario.objects.create(
        rut=rut,
        nombre=nombre,
        apellido=apellido,
        direccion=direccion,
        telefono=telefono,
        correo=correo,
        fecha_nacimiento=fecha_nacimiento,
        rol=rol,
        password=make_password(password)
    )
    usuario.save()
    return usuario

@require_municipalidad_role
def crear_colegio(request, nombre, direccion, telefono):
    """Función para crear un nuevo colegio y asociarlo a un director disponible."""
    try:
        # Obtener la municipalidad del administrador autenticado
        municipalidad = Municipalidad.objects.get(encargado=request.user)
        print(f"Municipalidad del administrador: {municipalidad}")
    except ObjectDoesNotExist:
        raise PermissionDenied('El administrador no tiene una municipalidad asociada.')
    # Obtener todos los directores del sistema
    directores = Usuario.objects.filter(rol='DIRECTOR')
    # Obtener el director disponible
    director = directores.filter(colegio__isnull=True).first()
    if director is None:
        raise PermissionDenied('No hay directores disponibles.')
    
    # Crear el colegio y asociarlo a la municipalidad y al director
    colegio = Colegio.objects.create(
        municipalidad=municipalidad,
        nombre=nombre,
        direccion=direccion,
        telefono=telefono,
        director=director
    )
    return colegio

@require_municipalidad_role
def eliminar_colegio(request, id):
    """Elimina un colegio por su ID."""
    try:
        colegio = Colegio.objects.get(id=id)
        colegio.delete()
        return {'mensaje': 'Colegio eliminado exitosamente.'}
    except Colegio.DoesNotExist:
        return {'error': 'Colegio no encontrado.'}
    except Exception as e:
        return {'error': str(e)}

@require_municipalidad_role
def obtener_resultados(request):
    """Obtiene los resultados de promedios, calificaciones y asistencias para los colegios asociados a la municipalidad del administrador autenticado."""
    resultados = {
        'promedios': obtener_promedios(request),
        'calificaciones': obtener_calificaciones(request),
        'asistencias': obtener_asistencias(request)
    }
    return resultados

def obtener_promedios(request):
    """Calcula los promedios de notas por colegio, curso y estudiante."""
    promedios_colegio = Colegio.objects.filter(municipalidad=request.user.municipalidad).annotate(promedio=Avg('cursos__inscripcion__estudiante__calificacion__nota')).order_by('-promedio')
    promedios_curso = Curso.objects.filter(colegio__municipalidad=request.user.municipalidad).annotate(promedio=Avg('inscripcion__estudiante__calificacion__nota')).order_by('-promedio')
    promedios_estudiante = Usuario.objects.filter(rol='ESTUDIANTE', inscripcion__curso__colegio__municipalidad=request.user.municipalidad).annotate(promedio=Avg('calificacion__nota')).order_by('-promedio')

    return {
        'colegios': [{'colegio': colegio.nombre, 'promedio': colegio.promedio} for colegio in promedios_colegio],
        'cursos': [{'curso': curso.nombre, 'promedio': curso.promedio} for curso in promedios_curso],
        'estudiantes': [{'estudiante': f"{estudiante.nombre} {estudiante.apellido}", 'promedio': estudiante.promedio} for estudiante in promedios_estudiante]
    }

def obtener_calificaciones(request):
    """Obtiene todas las calificaciones asociadas a los estudiantes de la municipalidad del administrador."""
    calificaciones = Calificacion.objects.filter(estudiante__inscripcion__curso__colegio__municipalidad=request.user.municipalidad)
    return {'calificaciones': list(calificaciones.values())}

def obtener_asistencias(request):
    """Obtiene todas las asistencias asociadas a los estudiantes de la municipalidad del administrador."""
    asistencias = Asistencia.objects.filter(estudiante__inscripcion__curso__colegio__municipalidad=request.user.municipalidad)
    return {'asistencias': list(asistencias.values())}
