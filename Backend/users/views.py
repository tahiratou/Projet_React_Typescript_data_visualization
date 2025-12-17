from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def inscription_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Utilisateur déjà existant'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Récupérer et modifier le profil utilisateur"""
    user = request.user
    
    if request.method == 'GET':
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined,
            'is_staff': user.is_staff,
        })
    
    elif request.method == 'PUT':
        # Mise à jour email
        email = request.data.get('email')
        if email:
            user.email = email
        
        # Mise à jour mot de passe
        new_password = request.data.get('new_password')
        current_password = request.data.get('current_password')
        
        if new_password and current_password:
            if user.check_password(current_password):
                user.set_password(new_password)
            else:
                return Response(
                    {'error': 'Mot de passe actuel incorrect'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        user.save()
        
        return Response({
            'message': 'Profil mis à jour avec succès',
            'username': user.username,
            'email': user.email,
        })
