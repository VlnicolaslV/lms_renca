#LMS/lms_renca/usuario/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .services import authenticate_user
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        rut = request.data.get('rut')
        password = request.data.get('password')

        if not rut or not password:
            return Response({"error": "rut y password son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = authenticate_user(rut, password)
            return Response(data, status=status.HTTP_200_OK)
        except AuthenticationFailed as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtener el usuario autenticado
        user = request.user  # Esto se maneja automáticamente si estás usando autenticación basada en tokens

        # Devolver los datos relevantes del usuario
        data = {
            "rut": user.rut,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "correo": user.correo,
            "rol": user.rol,
            "direccion": user.direccion,
            "telefono": user.telefono,
            "fecha_nacimiento": user.fecha_nacimiento,
        }
        return Response(data)
    

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "No refresh token provided"}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
