from django.db import models

# Create your models here.
class Player(models.Model):
    POSITION_CHOICES = [
        ('F', 'Forward'),
        ('D', 'Defense'),
        ('G', 'Goalie'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    jersey_number = models.PositiveIntegerField()
    position = models.CharField(max_length=1, choices=POSITION_CHOICES)

    def __str__(self):
        return f"#{self.jersey_number} {self.first_name} {self.last_name} ({self.get_position_display()})"
    
    
    
class Game(models.Model):
    LOCATION_CHOICES = [
        ('A', 'Away'),
        ('H', 'Home'),
    ]

    opponent = models.CharField(max_length=200)
    date = models.DateField()
    location = models.CharField(max_length=1, choices=LOCATION_CHOICES, default='H')

    def __str__(self):
        return f"vs {self.opponent} on {self.date}"
    
    
class PlayerGameStats(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    goals = models.PositiveIntegerField(default=0)
    assists = models.PositiveIntegerField(default=0)
    penalties = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('player', 'game')

    def __str__(self):
        return f"{self.player} stats for {self.game}"