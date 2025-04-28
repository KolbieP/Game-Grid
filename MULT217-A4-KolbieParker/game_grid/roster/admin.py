from django.contrib import admin
from .models import Player, Game, PlayerGameStats
# Register your models here.

admin.site.register(Player)
admin.site.register(Game)
admin.site.register(PlayerGameStats)