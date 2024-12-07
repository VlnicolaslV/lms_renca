#LMS/lms_renca/director/services.py
import pandas as pd
from django.contrib.auth.hashers import make_password
from django.db.models import Count, Avg, Q
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import PermissionDenied
from django.core.exceptions import ObjectDoesNotExist
from functools import wraps
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import (
    Usuario, Colegio, Curso, Asignatura, CursoAsignatura, Inscripcion, Calificacion, Asistencia
)


def require_director_role(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        
        if request.method == 'OPTIONS':  # No requiere autenticación para OPTIONS
            return view_func(request, *args, **kwargs)
        
        try:
            jwt_auth = JWTAuthentication()
            user, jwt_token = jwt_auth.authenticate(request)

            print("Token en el decorador:", jwt_token) # Imprimir el token
            print("Rol del usuario:", user.rol)
            if user is not None and user.rol == 'DIRECTOR':
                return view_func(request, *args, **kwargs)
            else:
                raise PermissionDenied("No tienes permiso para acceder a este recurso.")

        except Exception as e:
            raise PermissionDenied(f"Error de autenticación: {str(e)}")

    return _wrapped_view

@require_director_role
def crear_profesor(rut, nombre, apellido, direccion, telefono, correo, fecha_nacimiento, password):
    """Función para crear un usuario con rol de profesor en el sistema."""
    # Validamos que el rol es 'profesor'
    rol = 'PROFESOR'
    
    # Creamos el usuario utilizando el UsuarioManager y encriptamos la contraseña
    usuario = Usuario.objects.create(
        rut=rut,
        correo=correo,
        nombre=nombre,
        apellido=apellido,
        direccion=direccion,
        telefono=telefono,
        fecha_nacimiento=fecha_nacimiento,
        rol=rol,
        password=make_password(password)
    )

    # Guardamos el usuario y retornamos el objeto creado
    usuario.save()
    return usuario

@require_director_role
def crear_curso(request, nombre, grado):
    """Crea un nuevo curso y lo asocia al colegio del director autenticado."""
    try:
        # Obtener el colegio del director autenticado
        colegio = Colegio.objects.get(director=request.user)
        print(f"Colegio del director: {colegio}")
    except ObjectDoesNotExist:
        raise PermissionDenied("El director no está asociado a ningún colegio.")
    
    # Creamos el curso y lo asociamos al colegio
    curso = Curso.objects.create(
        colegio_id=colegio,
        nombre=nombre,
        grado=grado
    )
    return curso

@require_director_role
def crear_asignatura(nombre, curso_id, usuario_rut):
    """Crea una nueva asignatura y luego la asociamos a un curso y a un profesor. atravez de la tabla intermedia CursoAsignatura"""
    asignatura = Asignatura.objects.create(
        nombre=nombre,
        profesor_id=usuario_rut
    )
    CursoAsignatura.objects.create(
        curso_id=curso_id,
        asignatura_id=asignatura.id
    )
    return asignatura

@require_director_role
def obtener_colegios():
    """Obtiene todos los colegios registrados."""
    return Colegio.objects.all()

  
@require_director_role
def obtener_cursos(request):
    """Obtiene los cursos del colegio asociado al director autenticado."""
    try:
        # Obtener el colegio del director autenticado
        colegio = Colegio.objects.get(director=request.user)
        print(f"Colegio del director: {colegio}")  # Imprimir el colegio
    except ObjectDoesNotExist:
        raise PermissionDenied("El director no está asociado a ningún colegio.")

    # Filtrar cursos por el colegio del director
    cursos = Curso.objects.filter(colegio=colegio)
    print(f"Cursos obtenidos: {cursos}")  # Imprimir los cursos obtenidos
    return cursos

@require_director_role
def obtener_profesores(request):
    """Obtiene los profesores asociados a las asignaturas 
    que están asociadas a los cursos del colegio del director.
    """
    try:
        # Obtener el colegio del director autenticado
        colegio = Colegio.objects.get(director=request.user)
        print(f"Colegio del director: {colegio}")
    except ObjectDoesNotExist:
        raise PermissionDenied("El director no está asociado a ningún colegio.")

    # Obtener los profesores asociados a las asignaturas de los cursos del colegio
    profesores = Usuario.objects.filter(
        rol='PROFESOR',
        asignatura__cursoasignatura__curso__colegio=colegio  # Recorrer las relaciones
    ).distinct()

    print(f"Profesores obtenidos: {profesores}")
    return profesores

@require_director_role
def todos_profesores():
    """Obtiene todos los usuarios con rol de profesor."""
    return Usuario.objects.filter(rol='PROFESOR')

@require_director_role
def obtener_estudiantes(request):
    """Obtiene los estudiantes asociados a los cursos del colegio del director. atravez de la tabla Inscripcion"""
    try:
        # Obtener el colegio del director autenticado
        colegio = Colegio.objects.get(director=request.user)
        print(f"Colegio del director: {colegio}")
    except ObjectDoesNotExist:
        raise PermissionDenied("El director no está asociado a ningún colegio.")
    
    # Obtener los estudiantes asociados a los cursos del colegio
    estudiantes = Usuario.objects.filter(
        rol='ESTUDIANTE',
        inscripcion__curso__colegio=colegio  # Recorrer las relaciones
    ).distinct()
    
    print(f"Estudiantes obtenidos: {estudiantes}")
    return estudiantes
    
    
@require_director_role
def obtener_asignaturas(request):
    """Obtiene todas las asignaturas asociadas a los cursos del colegio del director."""
    try:
        # Obtener el colegio del director autenticado
        colegio = Colegio.objects.get(director=request.user)
        print(f"Colegio del director: {colegio}")
    except ObjectDoesNotExist:
        raise PermissionDenied("El director no está asociado a ningún colegio.")
    
    # Obtener las asignaturas asociadas a los cursos del colegio
    asignaturas = Asignatura.objects.filter(
        cursoasignatura__curso__colegio=colegio  # Recorrer las relaciones
    ).distinct()
    
    print(f"Asignaturas obtenidas: {asignaturas}")
    return asignaturas

@require_director_role
def obtener_inscripciones():
    return Inscripcion.objects.all()

@require_director_role
def obtener_calificaciones():
    """Obtiene todas las calificaciones registradas."""
    return Calificacion.objects.all()

@require_director_role
def obtener_asistencias():
    """Obtiene todas las asistencias registradas."""
    return Asistencia.objects.all()






    



@require_director_role
def crear_estudiante( rut, nombre, apellido, direccion, telefono, correo, fecha_nacimiento, password):
    """Función para crear un usuario con rol de estudiante en el sistema."""
    # Validamos que el rol es 'estudiante'
    rol = 'ESTUDIANTE'
    
    # Creamos el usuario utilizando el UsuarioManager y encriptamos la contraseña
    usuario = Usuario.objects.create(
        rut=rut,
        correo=correo,
        nombre=nombre,
        apellido=apellido,
        direccion=direccion,
        telefono=telefono,
        fecha_nacimiento=fecha_nacimiento,
        rol=rol,
        password=make_password(password)
    )

    # Guardamos el usuario y retornamos el objeto creado
    usuario.save()
    return usuario

@require_director_role
def crear_inscripcion(usuario_rut, curso_id):
    """Crea una nueva inscripción de un estudiante en un curso."""
    inscripcion = Inscripcion.objects.create(
        estudiante_id=usuario_rut,
        curso_id=curso_id
    )
    return inscripcion

@require_director_role
def obtener_estudiantes_del_colegio(request, curso_id=None, asignatura_id=None, fecha_nacimiento=None):
    """
    Obtiene todos los estudiantes del colegio a cargo del director que está autenticado.
    Filtra por curso, asignatura y fecha de nacimiento si se especifican.
    """
    try:
        # Obtener el colegio del director autenticado
        colegio = Colegio.objects.get(director_id=request.user.id)
    except ObjectDoesNotExist:
        raise PermissionDenied("El director no está asociado a ningún colegio.")

    # Crear filtros iniciales obligatorios (colegio y rol de estudiante)
    filtros = Q(inscripciones__curso__colegio_id=colegio.id) & Q(rol='ESTUDIANTE')

    # Aplicar filtros opcionales
    if curso_id:
        filtros &= Q(inscripciones__curso_id=curso_id)
    if asignatura_id:
        filtros &= Q(inscripciones__curso__asignaturas__id=asignatura_id)
    if fecha_nacimiento:
        filtros &= Q(fecha_nacimiento=fecha_nacimiento)

    # Ejecutar la consulta con todos los filtros aplicados en un solo paso
    estudiantes = Usuario.objects.filter(filtros)

    # Crear el DataFrame solo con los campos necesarios
    df = pd.DataFrame(estudiantes.values('rut', 'nombre', 'apellido', 'direccion', 'telefono', 'correo', 'fecha_nacimiento'))
    
    return df

@require_director_role
def obtener_promedio_calificaciones(request, curso_id=None, asignatura_id=None):
    """Obtiene el promedio de las calificaciones de los estudiantes de un curso y asignatura específicos."""

    # Filtramos calificaciones del colegio del director actual
    calificaciones = Calificacion.objects.filter(
        inscripcion__curso__colegio__director_id=request.user.id
    )

    # Aplicamos filtros adicionales si están definidos
    if curso_id:
        calificaciones = calificaciones.filter(inscripcion__curso_id=curso_id)
    if asignatura_id:
        calificaciones = calificaciones.filter(asignatura_id=asignatura_id)

    # Calculamos el promedio de las calificaciones
    promedio = calificaciones.aggregate(promedio=Avg('nota'))
    return promedio

@require_director_role
def obtener_calificaciones_data(request, curso_id=None, asignatura_id=None, profesor_rut=None, estudiante_rut=None):
    """obtiene los datos de las calificaciones de los estudiantes con filtros como curso, asignatura, profesor y estudiante y periodos (año, semestre, mes, dia)."""
    # Filtramos calificaciones relacionadas al colegio del director actual
    calificaciones = Calificacion.objects.select_related(
        'inscripcion__estudiante',
        'inscripcion__curso__colegio',
        'asignatura',
        'inscripcion__curso__profesor'
    ).filter(inscripcion__curso__colegio__director_id=request.user.id)

    # Aplicamos los filtros opcionales
    if curso_id:
        calificaciones = calificaciones.filter(inscripcion__curso_id=curso_id)
    if asignatura_id:
        calificaciones = calificaciones.filter(asignatura_id=asignatura_id)
    if profesor_rut:
        calificaciones = calificaciones.filter(inscripcion__curso__profesor_id=profesor_rut)
    if estudiante_rut:
        calificaciones = calificaciones.filter(inscripcion__estudiante_id=estudiante_rut)

    # Creamos un DataFrame con los datos de calificaciones filtrados
    df = pd.DataFrame(calificaciones.values())
    return df
    

@require_director_role
def obtener_asistencia_data(request, colegio_id=None, curso_id=None, asignatura_id=None, profesor_rut=None, estudiante_rut=None):
    """Obtiene los datos de asistencia con filtros opcionales y los retorna en un DataFrame."""

    # Filtramos asistencias relacionadas al colegio del director actual
    asistencias = Asistencia.objects.select_related(
        'inscripcion__estudiante',
        'inscripcion__curso__colegio',
        'inscripcion__curso__profesor'
    ).filter(inscripcion__curso__colegio__director_id=request.user.id)

    # Aplicamos los filtros opcionales
    if colegio_id:
        asistencias = asistencias.filter(inscripcion__curso__colegio_id=colegio_id)
    if curso_id:
        asistencias = asistencias.filter(inscripcion__curso_id=curso_id)
    if asignatura_id:
        asistencias = asistencias.filter(inscripcion__curso__asignaturas__id=asignatura_id)
    if profesor_rut:
        asistencias = asistencias.filter(inscripcion__curso__profesor_id=profesor_rut)
    if estudiante_rut:
        asistencias = asistencias.filter(inscripcion__estudiante_id=estudiante_rut)

    # Creamos un DataFrame con los datos de asistencia filtrados
    df = pd.DataFrame(asistencias.values())
    return df

@require_director_role
def obtener_estudiantes_con_mas_asistencias(request):
    """Obtiene los estudiantes con más asistencias en el colegio del director actual, con filtros por curso, asignatura, profesor y fecha."""
    asistencias = Asistencia.objects.select_related(
        'inscripcion__estudiante',
        'inscripcion__curso__colegio',
        'inscripcion__curso__profesor'
    ).filter(inscripcion__curso__colegio__director_id=request.user.rut, asistio=True)

    # Agrupamos por estudiante y contamos las asistencias
    asistencias = asistencias.values('inscripcion__estudiante').annotate(
        asistencias=Count('rut')
    ).order_by('-asistencias')

    # Creamos un DataFrame con los estudiantes y sus asistencias
    df = pd.DataFrame(asistencias)
    return df

@require_director_role
def obtener_estudiantes_con_mas_inasistencias(request):
    """Obtiene los estudiantes con más inasistencias en el colegio del director actual, con filtros por curso, asignatura, profesor y fecha."""
    inasistencias = Asistencia.objects.select_related(
        'inscripcion__estudiante',
        'inscripcion__curso__colegio',
        'inscripcion__curso__profesor'
    ).filter(inscripcion__curso__colegio__director_id=request.user.rut, asistio=False)

    # Agrupamos por estudiante y contamos las inasistencias
    inasistencias = inasistencias.values('inscripcion__estudiante').annotate(
        inasistencias=Count('rut')
    ).order_by('-inasistencias')

    # Creamos un DataFrame con los estudiantes y sus inasistencias
    df = pd.DataFrame(inasistencias)
    return df

@require_director_role
def calcular_datos_periodo(datos, periodo, fecha_inicio=None, fecha_fin=None):
    """Calcula los datos de un DataFrame agrupados por un periodo de tiempo (año, mes, día)."""
    # Convertimos la columna de fecha a un formato de fecha
    datos['fecha'] = pd.to_datetime(datos['fecha'])

    # Aplicamos el filtro de fecha si está definido
    if fecha_inicio:
        datos = datos[datos['fecha'] >= fecha_inicio]
    if fecha_fin:
        datos = datos[datos['fecha'] <= fecha_fin]

    # Agrupamos los datos por el periodo especificado
    if periodo == 'año':
        datos_agrupados = datos.groupby(datos['fecha'].dt.year).sum()
    elif periodo == 'mes':
        datos_agrupados = datos.groupby(datos['fecha'].dt.to_period('M')).sum()
    elif periodo == 'día':
        datos_agrupados = datos.groupby(datos['fecha'].dt.to_period('D')).sum()

    return datos_agrupados

@require_director_role
def procesar_asistencia_df(asistencias):
    """procesa los datos de las asistencia para la visualización en un gráfico."""
    asistencia_df = pd.DataFrame(list(asistencias.values(
        'estudiante__nombre', 'asignatura__nombre',
        'asignatura__cursoasignatura__curso__nombre',
        'asignatura__profesorasignatura__profesor__nombre',
        'presente', 'fecha', 'periodo'
    )))
    asistencia_df.columns = [
        'Estudiante', 'Asignatura', 'Curso', 'Profesor', 'Presente', 'Fecha', 'Periodo'
    ]
    #agregaciones para el reporte
    asistencia_agg = asistencia_df.groupby(['Periodo', 'Curso', 'Asignatura', 'Profesor', 'Estudiante'])['Presente'].agg(['sum', 'count'])
    asistencia_agg = asistencia_agg.reset_index()
    asistencia_agg['Porcentaje Asistencia'] = (asistencia_agg['sum'] / asistencia_agg['count']) * 100
    return asistencia_agg

@require_director_role
def procesar_calificaciones_df(calificaciones, periodo):
    #Procesa los datos de calificaciones para la visualización, 
    #calculando los promedios por curso, asignatura y estudiante.
    
    calificaciones_df = pd.DataFrame(list(calificaciones.values(
        'estudiante__nombre', 'asignatura__nombre',
        'asignatura__cursoasignatura__curso__nombre',
        'nota', 'fecha', 'periodo'
    )))
    calificaciones_df.columns = [
        'Estudiante', 'Asignatura', 'Curso', 'Nota', 'Fecha', 'Periodo'
    ]
    # Calcular promedios por curso, asignatura y estudiante
    promedios = calificaciones_df.groupby(['Periodo', 'Curso', 'Asignatura', 'Estudiante'])['Nota'].mean().reset_index()
    promedios.columns = ['Periodo', 'Curso', 'Asignatura', 'Estudiante', 'Promedio']
    return promedios