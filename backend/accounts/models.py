from django.db import models
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    """Modelo de Usuario extendido con empresa"""
    empresa = models.ForeignKey('config.Empresa', on_delete=models.CASCADE, null=True, blank=True, related_name='usuarios')
    
    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.username
