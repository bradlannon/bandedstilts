from django.db import models
from datetime import datetime

DISPLAY_CHOICES = (
    ('Y', 'Yes'),
    ('N', 'No'),
)

class Review(models.Model):
    title               = models.CharField(max_length=200)
    content             = models.TextField()
    company             = models.CharField(blank=True,max_length=200)
    website             = models.CharField(max_length=200,blank=True,default='http://www.')
    dateTime            = models.DateTimeField(default=datetime.now())
    displayPress        = models.CharField(max_length=1, choices=DISPLAY_CHOICES,default='Yes')

    def __unicode__(self):
        return self.title