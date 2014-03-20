from django.db import models

class Gallery(models.Models):
    image_field             =   models.ImageField()
    title                   =   models.CharField(max_length=200)