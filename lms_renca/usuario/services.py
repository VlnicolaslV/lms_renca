#LMS/lms_renca/usuario/services.py
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import Usuario

from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import Usuario

def authenticate_user(rut, password):
    Usuario = get_user_model()
    usuario = Usuario.objects.filter(rut=rut).first()
    
    if not usuario:
        raise AuthenticationFailed("Usuario no encontrado")

    if not usuario.is_active:
        raise AuthenticationFailed("El usuario está inactivo")

    if not usuario.check_password(password):
        raise AuthenticationFailed("Credenciales inválidas")

    refresh = RefreshToken.for_user(usuario)
    access_token = str(refresh.access_token)

    return {
        'access': access_token,
        'refresh': str(refresh),
        'rol': usuario.rol
    }
