#LMS/lms_renca/profesor/views.py
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from api.serializers import CursoAsignaturaSerializer, TareaSerializer, RecursoSerializer, ForoSerializer, ComentarioSerializer
from api.models import CursoAsignatura
from .services import (
    obtener_CursoAsignatura,
    obtener_estudiantes_curso,
    crear_tareas,
    obtener_tareas,
    calificar_tarea,
    obtener_calificaciones,
    crear_foro,
    obtener_foros,
    comentar_foro,
    obtener_comentarios,
    obtener_asistencias,
    tomar_asistencia,
    subir_recurso,
    obtener_recursos,
    ver_resultados_asistencia,
    ver_resultados_calificaciones,
    require_profesor_role,
    obtener_cursos_profesor
)
 
@api_view(['GET'])
@require_profesor_role
def obtener_cursos_profesor_view(request): 
    try: 
        cursos_asignatura = obtener_cursos_profesor(request) 
        return Response(cursos_asignatura) 
    except PermissionDenied as e: 
        return Response({'error': str(e)}, status=403) 
    except Exception as e: 
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@require_profesor_role
def obtener_curso_asignatura(request, id_curso_asignatura): 
    try: 
        curso_asignatura = get_object_or_404(CursoAsignatura, id=id_curso_asignatura) 
        serializer = CursoAsignaturaSerializer(curso_asignatura) 
        return Response(serializer.data) 
    except PermissionDenied as e: 
        return Response({'error': str(e)}, status=403) 
    except Exception as e: 
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@require_profesor_role
def obtener_estudiantes(request, id_curso_asignatura): 
    try: 
        estudiantes = obtener_estudiantes_curso(request, id_curso_asignatura) 
        return Response(estudiantes) 
    except PermissionDenied as e: 
        return Response({'error': str(e)}, status = 403)

@api_view(['POST'])  # Cambiado a POST
@require_profesor_role
def crear_tarea_view(request, id_curso_asignatura):
    titulo = request.data.get('titulo')
    descripcion = request.data.get('descripcion')
    fecha_publicacion = request.data.get('fecha_publicacion')
    fecha_entrega = request.data.get('fecha_entrega')
    archivo = request.FILES.get('archivo')  # Obtener el archivo del request

    try:
        tarea = crear_tareas(request, id_curso_asignatura, titulo, descripcion, fecha_publicacion, fecha_entrega, archivo)
        return Response({'tarea_id': tarea.id}, status=201)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@require_profesor_role
def obtener_tareas_view(request, id_curso_asignatura):
    try:
        tareas = obtener_tareas(request, id_curso_asignatura)
        serializer = TareaSerializer(tareas, many=True)
        return Response(serializer.data)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def calificar_tarea(request, id_tarea, id_estudiante):
    calificacion = request.data.get('calificacion')

    try:
        calificacion_obj = calificar_tarea(request, id_tarea, id_estudiante, calificacion)
        return Response({'calificacion': calificacion_obj.calificacion}, status=200)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtener_calificaciones(request, id_tarea):
    try:
        calificaciones = obtener_calificaciones(request, id_tarea)
        return Response(calificaciones)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['POST'])
@require_profesor_role
def crear_foro_view(request, id_curso_asignatura):
    titulo = request.data.get('titulo')
    tema = request.data.get('tema')
    fecha_creacion = request.data.get('fecha_creacion')

    try:
        foro = crear_foro(request, titulo, tema, fecha_creacion, id_curso_asignatura)  
        return Response({'foro_id': foro.id}, status=201)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_profesor_role
def obtener_foros_view(request, id_curso_asignatura):
    try:
        foros = obtener_foros(request, id_curso_asignatura)
        return Response(ForoSerializer(foros, many=True).data)  # Asegúrate de serializar los datos
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['POST'])
@require_profesor_role
def comentar_foro_view(request, id_foro):
    comentario = request.data.get('comentario')
    fecha_creacion = request.data.get('fecha_creacion')  # Obtener fecha_creacion del request

    try:
        comentario_obj = comentar_foro(request, id_foro, fecha_creacion, comentario)
        return Response(ComentarioSerializer(comentario_obj).data, status=201)  # Usar el serializador
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_profesor_role
def obtener_comentarios_view(request, id_foro):
    try:
        comentarios = obtener_comentarios(request, id_foro)
        return Response(ComentarioSerializer(comentarios, many=True).data)  # Serializar los comentarios
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_profesor_role
def obtener_asistencias_view(request, id_curso_asignatura):
    try:
        asistencias = obtener_asistencias(request, id_curso_asignatura)
        return Response(asistencias)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['POST'])
@require_profesor_role
def tomar_asistencia_view(request, id_curso_asignatura, rut_estudiante):
    fecha = request.data.get('fecha')
    presente = request.data.get('presente')

    try:
        asistencia_obj = tomar_asistencia(request, id_curso_asignatura, rut_estudiante, fecha, presente)
        return Response({'asistencia': asistencia_obj.presente}, status=201)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)




@api_view(['POST']) 
@require_profesor_role
def subir_recurso_view(request, id_curso_asignatura):
    nombre = request.data.get('nombre')
    descripcion = request.data.get('descripcion')
    archivo = request.data.get('archivo')
    fecha_creacion = request.data.get('fecha_creacion')  # Obtener fecha_creacion del request

    try:
        recurso = subir_recurso(request, nombre, descripcion, archivo, fecha_creacion, id_curso_asignatura)  # Pasar todos los argumentos necesarios
        return Response({'recurso_id': recurso.id}, status=201)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)



@api_view(['GET'])
@require_profesor_role
def obtener_recursos_view(request, id_curso_asignatura):
    try:
        recursos = obtener_recursos(request, id_curso_asignatura)
        return Response(RecursoSerializer(recursos, many=True).data)  # Asegúrate de serializar los datos
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)




@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ver_resultados_asistencia(request, id_curso_asignatura):
    try:
        resultados = ver_resultados_asistencia(request, id_curso_asignatura)
        return Response(resultados)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ver_resultados_calificaciones(request, id_curso_asignatura):
    try:
        resultados = ver_resultados_calificaciones(request, id_curso_asignatura)
        return Response(resultados)
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
