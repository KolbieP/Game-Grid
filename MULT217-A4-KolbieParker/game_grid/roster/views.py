from django.shortcuts import render
from rest_framework import generics, viewsets
from .models import Player, Game, PlayerGameStats
from .serializers import PlayerSerializer, GameSerializer, PlayerGameStatsSerializer
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from django.contrib.admin.views.decorators import staff_member_required

# Create your views here.

#This connects to the index.html
def api_home(request):
    return render(request, 'index.html')


# Allows basic CRUD operations for Player. Made it so that only admins can create/update/delete players
class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().order_by('id')
    serializer_class = PlayerSerializer
    ordering_fields = ['first_name', 'last_name', 'jersey_number']
    search_fields = ['first_name', 'last_name', 'jersey_number', 'position']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]


# Allows basic CRUD operations for Games. Made it so that only admins can create/update/delete games
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all().order_by('id')
    serializer_class = GameSerializer
    ordering_fields = ['opponent', 'date']
    search_fields = ['opponent', 'date']
      
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]
    
    
# Allows basic CRUD operations for player game stats. Made it so that only admins can create/update/delete 
class PlayerGameStatsViewSet(viewsets.ModelViewSet):
    queryset = PlayerGameStats.objects.all().order_by('id')
    serializer_class = PlayerGameStatsSerializer
    ordering_fields = ['player', 'game']
    search_fields = ['player', 'game']
    unique_together = ('player', 'game')
      
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]
    

