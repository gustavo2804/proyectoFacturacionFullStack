from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
from .serializer import RegisterSerializer
class customTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                access_token = response.data.get('access')
                refresh_token = response.data.get('refresh')
                
                # Obtener el usuario autenticado
                token = AccessToken(access_token)
                user_id = token['user_id']
                
                User = get_user_model()
                user = User.objects.get(id=user_id)
                
                # Crear respuesta con datos del usuario
                res = Response()
                res.data = {
                    'access': access_token,
                    'refresh': refresh_token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'empresa': {
                            'id': user.empresa.id if user.empresa else None,
                            'nombre': user.empresa.nombre if user.empresa else None,
                            'rnc': user.empresa.rnc if user.empresa else None,
                            'telefono': user.empresa.telefono if user.empresa else None,
                            'direccion': user.empresa.direccion if user.empresa else None,
                            'logo': user.empresa.logo.url if user.empresa and user.empresa.logo else None,
                        } if user.empresa else None,
                    },
                    'success': True,
                }
                
                # Configurar cookies (httponly=False para que JavaScript pueda leerlas)
                res.set_cookie(
                    key='access_token', 
                    value=access_token, 
                    httponly=False, 
                    secure=False,  # Cambiar a True en producción con HTTPS
                    samesite='Lax',
                    path='/'
                )

                res.set_cookie(
                    key='refresh_token', 
                    value=refresh_token, 
                    httponly=False, 
                    secure=False,  # Cambiar a True en producción con HTTPS
                    samesite='Lax',
                    path='/'
                )
                return res
            else:
                return response

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=400)

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            access_token = response.data.get('access')
            
            res = Response()
            res.data = {
                'refreshed': True,
            }
            res.set_cookie(
            key='access_token', 
            value=access_token, 
            httponly=False, 
            secure=False,  # Cambiar a True en producción con HTTPS
            samesite='Lax',
            path='/')

            return res
        except:
            return Response({
                'refreshed': False,
                'error': 'Refresh token is invalid'
            }, status=400)

@api_view(['POST'])
def logout(request):
    try:
        res = Response()
        res.data = {
            'logged_out': True,
        }
        res.delete_cookie('access_token', path='/', samesite='Lax')
        res.delete_cookie('refresh_token', path='/', samesite='Lax')
        return res
    except:
        return Response({
            'logged_out': False,
            'error': 'Logout failed'
        }, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    user = request.user
    return Response({
        'is_authenticated': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'empresa': {
                'id': user.empresa.id if user.empresa else None,
                'nombre': user.empresa.nombre if user.empresa else None,
                'rnc': user.empresa.rnc if user.empresa else None,
                'telefono': user.empresa.telefono if user.empresa else None,
                'direccion': user.empresa.direccion if user.empresa else None,
                'logo': user.empresa.logo.url if user.empresa and user.empresa.logo else None,
            } if user.empresa else None,
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)