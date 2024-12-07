#LMS/lms_renca/estudiante/views.py
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework import status
from api.models import Tarea
from api.serializers import TareaSerializer
from .services import (
    ver_cursos_y_asignaturas,
    obtener_calificaciones_estudiante,
    obtener_asistencias_estudiante,
    obtener_recursos_asignatura,
    descargar_recursos,
    obtener_foros_asignatura,
    participar_foro,
    comentar_foro,
    ver_notas,
    ver_promedios,
    obtener_tareas,
    ver_asistencia,
    promedio_de_asistencia,
    ver_resultados, require_estudiante_role, obtener_comentarios,
    subir_respuesta_tarea,
    obtener_respuestas
)


@api_view(['GET'])
@require_estudiante_role
def obtener_cursos_y_asignaturas_view(request): 
    try: 
        usuario = request.user 
        data = ver_cursos_y_asignaturas(request, usuario) 
        return Response(data) 
    except PermissionDenied as e: 
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtener_calificaciones(request):
    #obtiene las calificaciones del estudiante logeado en el sistema
    try:
        usuario = request.user
        calificaciones = obtener_calificaciones_estudiante(request, usuario)
        return Response(calificaciones)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
    
    

@api_view(['GET'])
@require_estudiante_role
def obtener_asistencias(request):
    #obtiene la asistencia del estudiante logeado en el sistema
    try:
        usuario = request.user
        asistencias = obtener_asistencias_estudiante(request, usuario)
        return Response(asistencias)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
    
    

@api_view(['GET'])
@require_estudiante_role
def obtener_recursos_asignatura_view(request, asignatura_id):
    #obtiene los recursos asociados a las asignaturas que tiene el curso en el cual esta inscrito el estudiante
    try:
        usuario = request.user
        recursos = obtener_recursos_asignatura(request, asignatura_id, usuario)
        return Response(recursos)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_estudiante_role
def descargar_recursos_view(request):
    try:
        usuario = request.user
        recursos_descargados = descargar_recursos(request, usuario)
        return Response({'recursos_descargados': recursos_descargados})
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_estudiante_role
def obtener_foros_asignatura_view(request, asignatura_id):
    """Obtiene los foros asociados a una asignatura específica."""
    try:
        usuario = request.user
        foros = obtener_foros_asignatura(request, asignatura_id, usuario)
        return Response(foros)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)


@api_view(['POST'])
@require_estudiante_role
def participar_foro_view(request):
    """Permite al estudiante participar en foros creando temas o respondiendo mensajes."""
    try:
        usuario = request.user
        datos_foro = request.data
        response = participar_foro(request, usuario, datos_foro)
        return Response(response)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)


@api_view(['POST'])
@require_estudiante_role
def comentar_foro_view(request, foro_id):
    try:
        usuario = request.user
        comentario = request.data.get('comentario')
        response = comentar_foro(request, foro_id, comentario, usuario)
        return Response(response)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)


@api_view(['GET'])
@require_estudiante_role
def obtener_comentarios_view(request, foro_id):
    """Obtiene todos los comentarios de un foro."""
    try:
        comentarios = obtener_comentarios(request, foro_id)
        return Response(comentarios)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ver_notas(request):
    """Obtiene las notas del estudiante que esta logeado en el sistema y las agrupa por asignatura."""
    try:
        usuario = request.user
        notas = ver_notas(request, usuario)
        return Response(notas)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ver_promedios(request):
    """Obtiene los promedios de un estudiante con filtro por asignatura y semestre"""
    try:
        usuario = request.user
        promedios = ver_promedios(request, usuario)
        return Response(promedios)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_estudiante_role
def obtener_tareas_view(request, estudiante_rut):
    try:
        usuario = request.user
        if usuario.rol != 'ESTUDIANTE' or usuario.rut != estudiante_rut:
            raise PermissionDenied("No tienes permisos para ver estas tareas.")
        return obtener_tareas(request, usuario)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@require_estudiante_role
def respuestas_view(request, estudiante_rut):
    try:
        usuario = request.user
        if usuario.rol != 'ESTUDIANTE' or usuario.rut != estudiante_rut:
            raise PermissionDenied("No tienes permisos para ver estas tareas.")
        return obtener_respuestas(request, usuario)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
    except Exception as e:
        return Response({'error': str(e)}, status=500)



@api_view(['POST'])
@require_estudiante_role
def subir_respuesta_view(request):
    try:
        usuario = request.user
        respuesta = subir_respuesta_tarea(request, usuario)
        return Response(respuesta, status=201)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
    except ValidationError as e:
        return Response({'error': str(e)}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)



@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ver_asistencia(request):
    try:
        usuario = request.user
        asistencia = ver_asistencia(request, usuario)
        return Response(asistencia)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def promedio_de_asistencia(request):
    """Obtiene el porcentaje de asistencia del estudiante logeado en el sistema y lo agrupamos por asignatura"""
    try:
        usuario = request.user
        promedio_asistencia = promedio_de_asistencia(request, usuario)
        return Response(promedio_asistencia)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ver_resultados(request):
    """Obtiene los reportes de progreso del estudiante."""
    try:
        usuario = request.user
        resultados = ver_resultados(request, usuario)
        return Response(resultados)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
 