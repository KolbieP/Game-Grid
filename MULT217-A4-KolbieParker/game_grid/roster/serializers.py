from rest_framework import serializers
from .models import Player, Game, PlayerGameStats
from rest_framework.validators import UniqueValidator

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['first_name', 'last_name', 'jersey_number', 'position']
        extra_kwargs = {
                    'jersey_number': {
                        'validators': [UniqueValidator(queryset=Player.objects.all())]
                    }
                }


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['opponent', 'date']


class PlayerGameStatsSerializer(serializers.ModelSerializer):
    player_name = serializers.SerializerMethodField()
    game_details = serializers.SerializerMethodField()

    class Meta:
        model = PlayerGameStats
        fields = ['player_name', 'game_details', 'goals', 'assists', 'penalties'] 

    def get_player_name(self, obj):
        return f"{obj.player.first_name} {obj.player.last_name}"

    def get_game_details(self, obj):
        return f"vs {obj.game.opponent} on {obj.game.date}"