# LMS/lms_renca/api/models.py
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# Manager personalizado para Usuario
class UsuarioManager(BaseUserManager):
    def create_user(self, rut, nombre, apellido, correo, password=None, **extra_fields):
        if not rut:
            raise ValueError("El usuario debe tener un RUT.")
        correo = self.normalize_email(correo)
        user = self.model(rut=rut, nombre=nombre, apellido=apellido, correo=correo, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, rut, nombre, apellido, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(rut, nombre, apellido, correo, password, **extra_fields)

# Modelo base para Usuario
class Usuario(AbstractBaseUser, PermissionsMixin):
    rut = models.CharField(max_length=20, unique=True, primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    direccion = models.CharField(max_length=80, blank=True)
    telefono = models.CharField(max_length=15, blank=True)
    correo = models.EmailField(max_length=50, unique=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)

    ROL_CHOICES = (
        ('ESTUDIANTE', 'Estudiante'),
        ('PROFESOR', 'Profesor'),
        ('DIRECTOR', 'Director'),
        ('ADMINISTRADOR', 'Municipalidad'),
    )
    rol = models.CharField(max_length=20, choices=ROL_CHOICES)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'rut'
    REQUIRED_FIELDS = ['nombre', 'apellido', 'correo']

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.rol}"

class Municipalidad(models.Model):
    nombre = models.CharField(max_length=70)
    encargado = models.OneToOneField(
        Usuario, on_delete=models.SET_NULL, null=True, limit_choices_to={'rol': 'ADMINISTRADOR'}
    )
    direccion = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)

    def __str__(self):
        return self.nombre

class Colegio(models.Model):
    municipalidad = models.ForeignKey(Municipalidad, on_delete=models.CASCADE, related_name="colegios")
    nombre = models.CharField(max_length=50)
    direccion = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)
    director = models.OneToOneField(
        Usuario, on_delete=models.SET_NULL, null=True, limit_choices_to={'rol': 'DIRECTOR'}
    )

    def __str__(self):
        return self.nombre

class Asignatura(models.Model):
    nombre = models.CharField(max_length=70)
    profesor = models.ForeignKey(
        Usuario, on_delete=models.SET_NULL, null=True, limit_choices_to={'rol': 'PROFESOR'}
    )

    def __str__(self):
        return self.nombre

class Curso(models.Model):
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE, related_name="cursos")
    nombre = models.CharField(max_length=25)
    grado = models.CharField(max_length=20)
    asignaturas = models.ManyToManyField(Asignatura, through='CursoAsignatura')

    def __str__(self):
        return f"{self.nombre} - {self.grado} ({self.colegio})"

class CursoAsignatura(models.Model):
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE)

class Inscripcion(models.Model):
    estudiante = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'ESTUDIANTE'}
    )
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('estudiante', 'curso')

class Tarea(models.Model):
    curso_asignatura = models.ForeignKey('CursoAsignatura', on_delete=models.CASCADE)
    titulo = models.CharField(max_length=255, default="Sin título")  # Nuevo campo para el título
    descripcion = models.TextField()  # Cambiado a TextField para más texto
    archivo = models.FileField(
        upload_to='tareas/',  # Carpeta donde se guardarán los archivos
        blank=True,          # Opcional: permite que el campo sea opcional
        null=True            # Opcional: permite valores nulos
    )
    fecha_publicacion = models.DateField()
    fecha_entrega = models.DateTimeField()

    def __str__(self):
        return f"Tarea: {self.titulo} - {self.curso_asignatura}"

class RespuestaTarea(models.Model):
    tarea = models.ForeignKey('Tarea', on_delete=models.CASCADE, related_name='respuestas')
    estudiante = models.ForeignKey('Usuario', on_delete=models.CASCADE, limit_choices_to={'rol': 'ESTUDIANTE'})
    archivo_respuesta = models.FileField(
        upload_to='respuestas_tareas/',
        blank=True,
        null=True
    )
    comentario = models.TextField(blank=True, null=True)  # Campo opcional para comentarios del estudiante
    fecha_envio = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Respuesta de {self.estudiante.nombre} {self.estudiante.apellido} a {self.tarea.titulo}"

class Foro(models.Model):
    titulo = models.CharField(max_length=50)
    tema = models.TextField()
    fecha_creacion = models.DateField()
    asignatura = models.ForeignKey(CursoAsignatura, on_delete=models.CASCADE)

    def __str__(self):
        return self.titulo

class Comentario(models.Model):
    foro = models.ForeignKey(Foro, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    comentario = models.TextField()
    fecha_creacion = models.DateField()

    def __str__(self):
        return f"Comentario de {self.usuario} en {self.foro}"

class Asistencia(models.Model):
    estudiante = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'ESTUDIANTE'}
    )
    asignatura = models.ForeignKey(CursoAsignatura, on_delete=models.CASCADE)
    fecha = models.DateField()
    presente = models.BooleanField(default=False)

    class Meta:
        unique_together = ('estudiante', 'asignatura', 'fecha')

class Calificacion(models.Model):
    estudiante = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'ESTUDIANTE'})
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE)
    fecha = models.DateField()
    nota = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ('estudiante', 'tarea', 'fecha')

    def __str__(self):
        return f"Calificacion: {self.estudiante} - {self.tarea} - {self.nota}"


class Recurso(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=250)
    archivo = models.FileField(upload_to='recursos/')
    fecha_creacion = models.DateField()
    asignatura = models.ForeignKey(CursoAsignatura, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
