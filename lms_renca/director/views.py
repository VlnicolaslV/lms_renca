from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from api.serializers import CursoSerializer
from api.models import Colegio, Curso, Usuario, Inscripcion, Asignatura, CursoAsignatura
from .services import (
    obtener_colegios, obtener_cursos, obtener_asignaturas,
    obtener_inscripciones, obtener_calificaciones, obtener_asistencias,
    crear_profesor, crear_curso, crear_asignatura, crear_estudiante, todos_profesores, 
    crear_inscripcion, obtener_estudiantes_del_colegio, obtener_promedio_calificaciones, 
    obtener_calificaciones_data, obtener_asistencia_data,
    obtener_estudiantes_con_mas_asistencias, obtener_estudiantes_con_mas_inasistencias,
    calcular_datos_periodo, procesar_asistencia_df, procesar_calificaciones_df, require_director_role, obtener_profesores , obtener_estudiantes
)
from rest_framework.exceptions import PermissionDenied
from django.core.exceptions import ObjectDoesNotExist

@api_view(['POST'])
@require_director_role 
def crear_curso(request):
    nombre = request.data.get('nombre')
    grado = request.data.get('grado')
    colegio_id = request.data.get('colegio')  # Asegúrate de que 'colegio' se envía desde el frontend

    # Imprime los datos para verificar que se reciben correctamente
    print(f"Nombre: {nombre}, Grado: {grado}, Colegio ID: {colegio_id}")

    try:
        colegio = Colegio.objects.get(pk=colegio_id)
        curso = Curso.objects.create(colegio=colegio, nombre=nombre, grado=grado)
        return Response({'mensaje': 'Curso creado correctamente'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['POST'])
@require_director_role 
def crear_profesor(request):
    """Crea un usuario con rol de profesor en el sistema"""
    rut = request.data.get('rut')
    nombre = request.data.get('nombre')
    apellido = request.data.get('apellido')
    correo = request.data.get('correo')
    direccion = request.data.get('direccion')
    telefono = request.data.get('telefono')
    fecha_nacimiento = request.data.get('fecha_nacimiento')
    rol = 'PROFESOR'
    password = request.data.get('password')  # Obtener la contraseña sin encriptar

    print(f"Rut: {rut}, Nombre: {nombre}, Apellido: {apellido}, Correo: {correo}, Dirección: {direccion}, Teléfono: {telefono}, Fecha de nacimiento: {fecha_nacimiento}, Rol: {rol}, Contraseña: {password}")

    try:
        # Encriptar la contraseña justo antes de crear el usuario
        password_encriptada = make_password(password) 
        profesor = Usuario.objects.create(
            rut=rut, 
            nombre=nombre, 
            apellido=apellido, 
            correo=correo, 
            direccion=direccion, 
            telefono=telefono, 
            fecha_nacimiento=fecha_nacimiento, 
            rol=rol, 
            password=password_encriptada  # Usar la contraseña encriptada
        )
        return Response({'mensaje': 'Profesor creado correctamente'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    


@api_view(['POST'])
@require_director_role 
def crear_estudiante(request):
    """Crea un usuario con rol de estudiante y lo inscribe en un curso."""
    rut = request.data.get('rut')
    nombre = request.data.get('nombre')
    apellido = request.data.get('apellido')
    correo = request.data.get('correo')
    direccion = request.data.get('direccion')
    telefono = request.data.get('telefono')
    fecha_nacimiento = request.data.get('fecha_nacimiento')
    rol = 'ESTUDIANTE'
    password = request.data.get('password')
    curso_id = request.data.get('curso_id')  # Obtener el ID del curso

    try:
        # Encriptar la contraseña
        password_encriptada = make_password(password)

        # Crear el estudiante
        estudiante = Usuario.objects.create(
            rut=rut, 
            nombre=nombre, 
            apellido=apellido, 
            correo=correo, 
            direccion=direccion, 
            telefono=telefono, 
            fecha_nacimiento=fecha_nacimiento, 
            rol=rol, 
            password=password_encriptada
        )

        # Crear la inscripción en el curso
        inscripcion = Inscripcion.objects.create(
            estudiante=estudiante, 
            curso_id=curso_id 
        )

        return Response({'mensaje': 'Estudiante creado e inscrito correctamente'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['POST'])
@require_director_role
def crear_asignatura(request):
    """
    Crea una asignatura, la asocia a un profesor y a un curso, 
    y guarda la relación en la tabla CursoAsignatura.
    """
    nombre = request.data.get('nombre')
    profesor_rut = request.data.get('profesor_rut')  # RUT del profesor
    curso_id = request.data.get('curso_id')  # ID del curso

    try:
        # Crear la asignatura
        asignatura = Asignatura.objects.create(
            nombre=nombre,
            profesor_rut=profesor_rut  # Asignar el profesor por RUT
        )

        # Crear la relación en CursoAsignatura
        curso_asignatura = CursoAsignatura.objects.create(
            curso_id=curso_id,
            asignatura=asignatura 
        )

        return Response({
            'mensaje': 'Asignatura creada y asociada correctamente', 
            'asignatura_id': asignatura.id,
            'curso_asignatura_id': curso_asignatura.id
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
@require_director_role
def obtener_colegio_director(request):
    """Obtiene el colegio del director autenticado."""
    try:
        colegio = Colegio.objects.get(director=request.user)
        return Response({'id': colegio.id, 'nombre': colegio.nombre})
    except ObjectDoesNotExist:
        return Response({'error': 'El director no está asociado a ningún colegio.'}, status=403)
    
# Definir las vistas basadas en funciones o clases
@api_view(['GET'])
@require_director_role
def colegios(request):
    """Obtiene todos los colegios registrados."""
    try:
        colegios = obtener_colegios(request)
        return Response({'colegios': colegios.values()})
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)


@api_view(['GET'])
@require_director_role
def cursos(request):
    """Obtiene todos los cursos registrados."""
    try:
        print("Cabecera Authorization:", request.headers.get('Authorization')) # Imprimir la cabecera

        cursos = obtener_cursos(request)
        return Response({'cursos': cursos.values()})
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)
    
@api_view(['GET'])
@require_director_role
def todos_profesores1(request):
    """Obtiene todos los profesores registrados."""
    try:
        profesores = todos_profesores(request)
        return Response({'profesores': profesores.values()})
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)    
    
@api_view(['GET'])
@require_director_role
def profesores(request):
    """Obtiene los profesores asociados a los cursos del colegio del director."""
    try:
        profesores = obtener_profesores(request)
        return Response({'profesores': profesores.values()})
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_director_role
def estudiantes(request):
    """Obtiene todos los estudiantes registrados."""
    try:
        estudiantes = obtener_estudiantes(request)
        return Response({'estudiantes': estudiantes.values()})
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_director_role
def asignaturas(request):
    """Obtiene todas las asignaturas asociadas a los cursos del colegio del director."""
    try:
        asignaturas = obtener_asignaturas(request)
        return Response({'asignaturas': asignaturas.values()})
    except PermissionDenied as e:
        return Response({'error': str(e)}, status=403)

  
 




@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def crear_inscripcion_view(request):
    """Crea una inscripción de estudiante en un curso."""
    data = request.data
    inscripcion = crear_inscripcion(**data)
    return Response({'inscripcion': inscripcion.values()})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def estudiantes_del_colegio(request):
    """Obtiene estudiantes del colegio, con filtros opcionales."""
    filters = request.query_params
    estudiantes = obtener_estudiantes_del_colegio(request, **filters)
    return Response({'estudiantes': estudiantes.to_dict()})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def promedio_calificaciones(request):
    """Obtiene el promedio de calificaciones."""
    filters = request.query_params
    promedio = obtener_promedio_calificaciones(request, **filters)
    return Response({'promedio': promedio})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def calificaciones_data(request):
    """Obtiene los datos de las calificaciones con filtros opcionales."""
    filters = request.query_params
    data = obtener_calificaciones_data(request, **filters)
    return Response({'calificaciones': data.to_dict()})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def asistencia_data(request):
    """Obtiene los datos de asistencia con filtros opcionales."""
    filters = request.query_params
    data = obtener_asistencia_data(request, **filters)
    return Response({'asistencia': data.to_dict()})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def estudiantes_con_mas_asistencias(request):
    """Obtiene los estudiantes con más asistencias."""
    data = obtener_estudiantes_con_mas_asistencias(request)
    return Response({'estudiantes_con_mas_asistencias': data.to_dict()})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def estudiantes_con_mas_inasistencias(request):
    """Obtiene los estudiantes con más inasistencias."""
    data = obtener_estudiantes_con_mas_inasistencias(request)
    return Response({'estudiantes_con_mas_inasistencias': data.to_dict()})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtener_inscripciones(request):
    """Obtiene todas las inscripciones."""
    inscripciones = obtener_inscripciones(request)
    return Response({'inscripciones': inscripciones.values()})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtener_calificaciones(request):
    """Obtiene todas las calificaciones."""
    calificaciones = obtener_calificaciones(request)
    return Response({'calificaciones': calificaciones.values()})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtener_asistencias(request):
    """Obtiene todas las asistencias."""
    asistencias = obtener_asistencias(request)
    return Response({'asistencias': asistencias.values()})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def calcular_datos_periodo(request):
    """Calcula los datos de calificaciones y asistencia de un periodo."""
    datos_periodo = request.query_params
    datos_periodo = calcular_datos_periodo(request, **datos_periodo)
    return Response({'datos-periodo': datos_periodo})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def procesar_asistencia_df(request):
    """Procesa los datos de asistencia."""
    procesar_asistencia = request.query_params
    procesar_asistencia = procesar_asistencia_df(request, **procesar_asistencia)
    return Response({'procesar-asistencia': procesar_asistencia})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def procesar_calificaciones_df(request):
    """Procesa los datos de calificaciones."""
    procesar_calificaciones = request.query_params
    procesar_calificaciones = procesar_calificaciones_df(request, **procesar_calificaciones)
    return Response({'procesar-calificaciones': procesar_calificaciones})