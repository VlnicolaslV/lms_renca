#LMS/lms_renca/usuario/urls.py
from django.urls import path
from .views import LoginView, UserProfileView, LogoutView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('cerrar_sesion/', LogoutView.as_view(), name='cerrar_sesion'),
]