#LMS/lms_renca/estudiante/services.py
import pandas as pd
from django.db.models import Count, Avg, Q
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.serializers import CursoSerializer, AsignaturaSerializer, ForoSerializer, ComentarioSerializer, RecursoSerializer, RespuestaTareaSerializer
from rest_framework.exceptions import PermissionDenied, ValidationError
from functools import wraps
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from api.serializers import TareaSerializer
from api.models import (
    Usuario, Curso, Asignatura, CursoAsignatura, Inscripcion, Calificacion, Asistencia, Recurso, Foro, Comentario, Tarea, RespuestaTarea
)

 
def require_estudiante_role(func):
    """decordador que valida que el usuario autenticado tenga el rol de estudiante."""
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        jwt_auth = JWTAuthentication()
        try:
            validated_token = jwt_auth.get_validated_token(request.headers.get('Authorization').split()[1])
            user = jwt_auth.get_user(validated_token)
            if user.rol != 'ESTUDIANTE':
                raise PermissionDenied("El usuario no tiene permisos para realizar esta acción.")
            request.user = user
        except Exception:
            raise PermissionDenied("El usuario no tiene permisos para realizar esta acción.")
        return func(request, *args, **kwargs)            
    return wrapper


@require_estudiante_role
def ver_cursos_y_asignaturas(request, usuario):
    """Obtiene los cursos y asignaturas en los que está inscrito un estudiante."""
    inscripciones = Inscripcion.objects.filter(estudiante=usuario).select_related('curso')
    cursos = [inscripcion.curso for inscripcion in inscripciones]
    asignaturas = Asignatura.objects.filter(cursoasignatura__curso__in=cursos)

    serialized_cursos = CursoSerializer(cursos, many=True).data
    serialized_asignaturas = AsignaturaSerializer(asignaturas, many=True).data

    return {
        "cursos": serialized_cursos,
        "asignaturas": serialized_asignaturas
    }


@require_estudiante_role
def obtener_calificaciones_estudiante(request, usuario):
    """Obtiene las calificaciones del estudiante logeado en el sistema."""
    calificaciones = Calificacion.objects.filter(estudiante=usuario)
    return calificaciones

@require_estudiante_role
def obtener_asistencias_estudiante(request, usuario):
    """Obtiene las asistencias del estudiante logeado en el sistema."""
    asistencias = Asistencia.objects.filter(estudiante=usuario)
    return asistencias

@require_estudiante_role
def obtener_recursos_asignatura(request, asignatura_id, usuario):
    """Obtiene los recursos asociados a una asignatura específica."""
    # Obtenemos la asignatura específica basada en asignatura_id
    curso_asignatura = CursoAsignatura.objects.filter(asignatura_id=asignatura_id, curso__inscripcion__estudiante=usuario)

    # Verificamos si el curso_asignatura existe
    if not curso_asignatura.exists():
        raise ValueError("No se encontró la asignatura asociada al curso del estudiante.")

    # Obtenemos los recursos asociados a la asignatura
    recursos = Recurso.objects.filter(asignatura__in=curso_asignatura)
    return RecursoSerializer(recursos, many=True).data


@require_estudiante_role
def descargar_recursos(request, usuario):
    """Obtiene y permite descargar los recursos de aprendizaje del estudiante."""
    recursos = Recurso.objects.filter(asignatura__cursoasignatura__curso__inscripcion__estudiante=usuario)
    recursos_descargados = []
    for recurso in recursos:
        path = f'/path/to/downloads/{recurso.nombre}'
        with open(path, 'wb') as archivo:
            archivo.write(recurso.archivo.read())
        recursos_descargados.append({"nombre": recurso.nombre, "ruta": path})
    return {"recursos_descargados": recursos_descargados}


@require_estudiante_role
def obtener_foros_asignatura(request, asignatura_id, usuario):
    """Obtiene los foros asociados a una asignatura específica."""
    foros = Foro.objects.filter(asignatura_id=asignatura_id)
    return ForoSerializer(foros, many=True).data


@require_estudiante_role
def participar_foro(request, usuario, datos_foro):
    """Permite al estudiante participar en foros creando temas o respondiendo mensajes."""
    try:
        foro_id = datos_foro.get('foro_id')
        contenido = datos_foro.get('contenido')
        es_nuevo_tema = datos_foro.get('es_nuevo_tema', False)

        if not foro_id or not contenido:
            raise ValidationError("Faltan datos obligatorios para participar en el foro.")

        foro = Foro.objects.get(id=foro_id)

        if es_nuevo_tema:
            nuevo_tema = Foro.objects.create(
                asignatura=foro.asignatura,
                titulo=f"{usuario.nombre} - Nuevo tema",
                tema=contenido,
                fecha_creacion=datos_foro.get('fecha_creacion')
            )
            return {"mensaje": "Nuevo tema creado exitosamente.", "foro": ForoSerializer(nuevo_tema).data}

        comentario = Comentario.objects.create(
            foro=foro,
            usuario=usuario,
            comentario=contenido,
            fecha_creacion=datos_foro.get('fecha_creacion')
        )
        return {"mensaje": "Comentario agregado exitosamente.", "comentario": ComentarioSerializer(comentario).data}
    except Foro.DoesNotExist:
        raise ValidationError("El foro no existe.")


@require_estudiante_role
def comentar_foro(request, id_foro, comentario, usuario):
    """Comenta un foro."""
    foro = Foro.objects.get(id=id_foro)
    comentario = Comentario.objects.create(
        foro=foro,
        usuario=usuario,
        comentario=comentario,
        fecha_creacion=request.data.get('fecha_creacion')
    )
    return ComentarioSerializer(comentario).data


@require_estudiante_role
def obtener_comentarios(request, id_foro):
    """Obtiene todos los comentarios de un foro."""
    foro = Foro.objects.get(id=id_foro)
    comentarios = Comentario.objects.filter(foro=foro)
    return ComentarioSerializer(comentarios, many=True).data


@require_estudiante_role
def ver_notas(request, usuario):
    """Obtiene las notas del estudiante que esta logeado en el sistema y las agrupa por asignatura."""
    calificaciones = Calificacion.objects.filter(estudiante=usuario).select_related('asignatura')
    notas = calificaciones.values('asignatura__nombre').annotate(
        promedio=Avg('nota')
    )
    return {"notas": list(notas)}

@require_estudiante_role
def ver_promedios(request, usuario):
    """Obtiene los promedios de un estudiante con filtro por asignatura y semestre"""
    # Obtenemos las calificaciones del estudiante
    calificaciones = Calificacion.objects.filter(estudiante=usuario)

    # Obtenemos los promedios de las calificaciones agrupadas por asignatura y semestre
    promedios = calificaciones.values('asignatura__nombre', 'semestre').annotate(
        promedio=Avg('nota')
    )
    return promedios


@require_estudiante_role
def obtener_tareas(request, usuario):
    """Obtiene las tareas del estudiante asociadas al curso en el cual está inscrito."""
    inscripciones = Inscripcion.objects.filter(estudiante=usuario)
    cursos = [inscripcion.curso for inscripcion in inscripciones]
    curso_asignaturas = CursoAsignatura.objects.filter(curso__in=cursos)
    tareas = Tarea.objects.filter(curso_asignatura__in=curso_asignaturas)
    serializer = TareaSerializer(tareas, many=True)
    return Response(serializer.data)


@require_estudiante_role
def subir_respuesta_tarea(request, usuario):
    serializer = RespuestaTareaSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(estudiante=usuario)  # Asignar el estudiante automáticamente
        return serializer.data
    else:
        raise ValidationError(serializer.errors)


@require_estudiante_role
def obtener_respuestas(estudiante_rut):
    estudiante = get_object_or_404(Usuario, rut=estudiante_rut, rol='ESTUDIANTE')
    respuestas = RespuestaTarea.objects.filter(estudiante=estudiante)
    return RespuestaTareaSerializer(respuestas, many=True).data



@require_estudiante_role
def ver_asistencia(request, usuario):
    """Obtiene la asistencia del estudiante agrupada por asignatura."""
    asistencias = Asistencia.objects.filter(estudiante=usuario).select_related('asignatura')
    asistencia_detalle = asistencias.values('asignatura__nombre').annotate(
        total=Count('id'),
        presentes=Count('presente', filter=Q(presente=True)),
        porcentaje_asistencia=Count('presente', filter=Q(presente=True)) * 100 / Count('id')
    )
    return {"asistencia": list(asistencia_detalle)}

@require_estudiante_role
def promedio_de_asistencia(request, usuario):
    """Obtiene el porcentaje de asistencia del estudiante logeado en el sistema y lo agrupamos por asignatura"""
    asistencias = Asistencia.objects.filter(estudiante=usuario)
    asistencia = asistencias.values('asignatura__nombre').annotate(
        porcentaje_asistencia=Count('presente', filter=Q(presente=True)) * 100 / Count('id')
    )
    return {"asistencia": list(asistencia)}


@require_estudiante_role
def ver_resultados(request, usuario):
    """Obtiene los reportes de progreso del estudiante."""
    calificaciones = Calificacion.objects.filter(estudiante=usuario).select_related('asignatura')
    promedios = calificaciones.values('asignatura__nombre').annotate(promedio=Avg('nota'))
    return {"resultados": list(promedios)}