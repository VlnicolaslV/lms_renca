from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.http import HttpResponse
from api.serializers import UsuarioSerializer
from api.models import Municipalidad, Usuario, Colegio
from .services import (
    obtener_municipalidades,
    obtener_colegios,
    obtener_directores,
    obtener_cursos,
    obtener_asignaturas,
    obtener_inscripciones,
    crear_director,
    crear_colegio,
    require_municipalidad_role,
    eliminar_colegio,
    obtener_resultados,
    obtener_directores_sin_colegio
)

@api_view(['POST'])
@require_municipalidad_role
def crear_colegio_view(request):
    """
    Crea un colegio, lo asocia a una municipalidad y le asigna un director.
    """
    nombre = request.data.get('nombre')
    direccion = request.data.get('direccion')
    telefono = request.data.get('telefono')
    municipalidad_id = request.data.get('municipalidadId')
    rut_director = request.data.get('directorRut')
    
    try:
        # Obtener la municipalidad
        municipalidad = Municipalidad.objects.get(id=municipalidad_id)
        # Obtener el director
        director = Usuario.objects.get(rut=rut_director)
        # Crear el colegio
        colegio = Colegio.objects.create(
            nombre=nombre,
            direccion=direccion,
            telefono=telefono,
            municipalidad=municipalidad,
            director=director
        )
        return Response({'mensaje': 'Colegio creado exitosamente'}, status=201)
    except Municipalidad.DoesNotExist:
        return Response({'error': 'Municipalidad no encontrada.'}, status=400)
    except Usuario.DoesNotExist:
        return Response({'error': 'Director no encontrado.'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

    
@api_view(['POST'])
@require_municipalidad_role
def crear_director_view(request):
    """
    Crea un director y lo asocia a la municipalidad del administrador autenticado.
    """
    rut = request.data.get('rut')
    nombre = request.data.get('nombre')
    apellido = request.data.get('apellido')
    direccion = request.data.get('direccion')
    telefono = request.data.get('telefono')
    correo = request.data.get('correo')
    fecha_nacimiento = request.data.get('fecha_nacimiento')
    rol = 'DIRECTOR'
    password = request.data.get('password')
    
    print(f"rut: {rut}, nombre: {nombre}, apellido: {apellido}, direccion: {direccion}, telefono: {telefono}, correo: {correo}, fecha_nacimiento: {fecha_nacimiento}, rol: {rol}, password: {password}")
    
    try:
        # Encriptar la contraseña justo antes de crear el usuario
        password_encriptada = make_password(password)
        director = Usuario.objects.create(
            rut=rut,
            nombre=nombre,
            apellido=apellido,
            direccion=direccion,
            telefono=telefono,
            correo=correo,
            fecha_nacimiento=fecha_nacimiento,
            rol=rol,
            password=password_encriptada
        )
        return Response({'mensaje': 'Director creado exitosamente'}, status=201)
    except Exception as e:
        return Response({'mensaje': str(e)}, status=400)
    
@api_view(['GET'])
@require_municipalidad_role
def obtener_municipalidades_view(request):
    """
    Obtiene todas las municipalidades registradas en el sistema.
    """
    try:
        municipalidades = obtener_municipalidades(request)
        return Response(municipalidades, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_municipalidad_role
def obtener_colegios_view(request):
    """
    Obtiene todos los colegios asociados a la municipalidad del administrador autenticado.
    """
    try:
        colegios = obtener_colegios(request)
        data = [{"id": colegio.id, "nombre": colegio.nombre, "direccion": colegio.direccion, "telefono": colegio.telefono} for colegio in colegios]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=403)

    
@api_view(['GET'])
@require_municipalidad_role
def obtener_directores_view(request):
    """
    Obtiene todos los directores asociados a los colegios de la municipalidad del administrador autenticado.
    """
    try:
        directores = obtener_directores(request)
        return Response({'directores': directores}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=403)
     
@api_view(['GET'])
@require_municipalidad_role
def obtener_directores_sin_colegio_view(request):
    """
    Obtiene todos los directores que no tienen colegio asociado.
    """
    try:
        directores = obtener_directores_sin_colegio(request)
        return Response(directores, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=403)
    
@api_view(['GET'])
@require_municipalidad_role
def obtener_cursos_view(request):
    """
    Obtiene todos los cursos asociados a los colegios de la municipalidad del administrador autenticado.
    """
    try:
        cursos = obtener_cursos(request)
        return Response(cursos, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=403)
    
@api_view(['GET'])
@require_municipalidad_role
def obtener_asignaturas_view(request):
    """
    Obtiene todas las asignaturas asociadas a los cursos de la municipalidad del administrador autenticado.
    """
    try:
        asignaturas = obtener_asignaturas(request)
        return Response(asignaturas, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=403)
    
@api_view(['GET'])
@require_municipalidad_role
def obtener_inscripciones_view(request):
    """
    Obtiene todas las inscripciones asociadas a los cursos de la municipalidad del administrador autenticado.
    """
    try:
        inscripciones = obtener_inscripciones(request)
        return Response(inscripciones, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=403)

@api_view(['DELETE']) 
@require_municipalidad_role 
def eliminar_colegio_view(request, id): 
    """ Elimina un colegio por su ID """ 
    try:
        resultado = eliminar_colegio(request, id) 
        if 'error' in resultado: 
            return Response({'error': resultado['error']}, status=400) 
        return Response({'mensaje': resultado['mensaje']}, status=204)
    except Exception as e:
        return Response({'error': str(e)}, status=403)

@api_view(['GET'])
@require_municipalidad_role
def obtener_resultados_view(request):
    """
    Obtiene los resultados de promedios, calificaciones y asistencias para los colegios asociados a la municipalidad del administrador autenticado.
    """
    try:
        resultados = obtener_resultados(request)
        return Response(resultados, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=403)
