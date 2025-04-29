from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlayerViewSet, GameViewSet, PlayerGameStatsViewSet, api_home

router = DefaultRouter()
router.register(r'players', PlayerViewSet)
router.register(r'games', GameViewSet)
router.register(r'playergamestats', PlayerGameStatsViewSet)

urlpatterns = [
     path('', api_home),  
    path('', include(router.urls)),
]