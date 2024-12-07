# api/serializers.py
from rest_framework import serializers
from .models import Usuario, Municipalidad, Colegio, Asignatura, CursoAsignatura, Inscripcion, Curso, Tarea, RespuestaTarea, Foro, Asistencia, Calificacion, Recurso, Comentario

# Serializador para Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['rut', 'username', 'nombre', 'apellido', 'direccion', 'telefono', 'correo', 'fecha_nacimiento']

# Serializador para Municipalidad
class MunicipalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipalidad
        #todos los campos de la tabla Municipalidad
        fields = '__all__'
# Serializador para Colegio
class ColegioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colegio
        fields = '__all__'

# Serializador para Asignatura
class AsignaturaSerializer(serializers.ModelSerializer):
    profesor_nombre = serializers.CharField(source='profesor.nombre', read_only=True)
    profesor_apellido = serializers.CharField(source='profesor.apellido', read_only=True)
    
    class Meta:
        model = Asignatura
        fields = ['id', 'nombre', 'profesor_nombre', 'profesor_apellido']

# Serializador para CursoAsignatura
class CursoAsignaturaSerializer(serializers.ModelSerializer):
    asignatura = AsignaturaSerializer()
    curso_nombre = serializers.CharField(source='curso.nombre', read_only=True)
    curso_grado = serializers.CharField(source='curso.grado', read_only=True)
    colegio_nombre = serializers.CharField(source='curso.colegio.nombre', read_only=True)
    
    class Meta:
        model = CursoAsignatura
        fields = ['id', 'asignatura', 'curso_nombre', 'curso_grado', 'colegio_nombre']

# Serializador para Curso donde se obtienen los cursos de un colegio
class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'

# Serializador para Tarea
class TareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = '__all__'
        
class RespuestaTareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespuestaTarea
        fields = ['id', 'tarea', 'estudiante', 'archivo_respuesta', 'comentario', 'fecha_envio']
        read_only_fields = ['fecha_envio']

    def validate(self, data):
        # Asegurar que solo estudiantes puedan enviar respuestas
        if self.context['request'].user.rol != 'ESTUDIANTE':
            raise serializers.ValidationError("Solo los estudiantes pueden enviar respuestas.")
        return data

# Serializador para Foro
class ForoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Foro
        fields = '__all__'

# Serializador para Asistencia
class AsistenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistencia
        fields = '__all__'

# Serializador para Calificación
class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificacion
        fields = '__all__'
        
# Serializador para Recurso
class RecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recurso
        fields = '__all__'


class ComentarioSerializer(serializers.ModelSerializer):
    usuario_rut = serializers.CharField(source='usuario.rut')
    usuario_nombre = serializers.CharField(source='usuario.nombre')

    class Meta:
        model = Comentario
        fields = ['id', 'foro', 'usuario_rut', 'usuario_nombre', 'comentario', 'fecha_creacion']

        
class InscripcionSerializer(serializers.ModelSerializer):
    estudiante_rut = serializers.CharField(source='estudiante.rut')
    estudiante_nombre = serializers.CharField(source='estudiante.nombre')
    estudiante_apellido = serializers.CharField(source='estudiante.apellido')
    curso_nombre = serializers.CharField(source='curso.nombre')
    curso_grado = serializers.CharField(source='curso.grado')

    class Meta:
        model = Inscripcion
        fields = ['id', 'estudiante_rut', 'estudiante_nombre', 'estudiante_apellido', 'curso_nombre', 'curso_grado']

